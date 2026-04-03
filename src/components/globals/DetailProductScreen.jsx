/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { Slider } from "./Slider";
import { Rating } from "./Rating";
import { BaseButton } from "./BaseButton";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPrice, scrollTop } from "../../../globalActions";
import Swal from "sweetalert2";
import styled from "styled-components";
import { useEffect, useState, useCallback } from "react";
import { clearProduct, selectedProduct } from "../../actions/productActions";
import { useForm } from "../../hooks/useForm";
import { useValidations } from "../../hooks/useValidations";
import { useParams } from "react-router-dom";
import { useSlugify } from "../../reducers/useSlugify";

/** Convierte hex/nombre CSS a [r, g, b] */
const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
};

/** Distancia euclidiana entre dos colores RGB */
const colorDistance = ([r1, g1, b1], [r2, g2, b2]) =>
  Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);

/** Extrae el color dominante de una imagen via Canvas */
const getDominantColor = (imgSrc) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    const timeoutId = setTimeout(() => {
      resolve([128, 128, 128]);
    }, 5000);
    
    img.onload = () => {
      clearTimeout(timeoutId);
      const canvas = document.createElement("canvas");
      const size = 80;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, size, size);

      const { data } = ctx.getImageData(0, 0, size, size);
      const colorCount = {};

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue;
        if (r > 240 && g > 240 && b > 240) continue;

        const roundedR = Math.round(r / 20) * 20;
        const roundedG = Math.round(g / 20) * 20;
        const roundedB = Math.round(b / 20) * 20;
        const key = `${roundedR},${roundedG},${roundedB}`;
        
        if (!colorCount[key]) {
          colorCount[key] = { count: 0, r: 0, g: 0, b: 0 };
        }
        colorCount[key].count++;
        colorCount[key].r += r;
        colorCount[key].g += g;
        colorCount[key].b += b;
      }

      let maxCount = 0;
      let dominantColor = [128, 128, 128];
      
      Object.values(colorCount).forEach((color) => {
        if (color.count > maxCount) {
          maxCount = color.count;
          dominantColor = [
            Math.round(color.r / color.count),
            Math.round(color.g / color.count),
            Math.round(color.b / color.count),
          ];
        }
      });

      resolve(dominantColor);
    };
    img.onerror = () => {
      clearTimeout(timeoutId);
      resolve([128, 128, 128]);
    };
    img.src = imgSrc;
  });

// ─── Mapa de colores del selector con sus valores RGB exactos ───────────────
const colorMapExact = {
  negro: { hex: "#000000", rgb: [0, 0, 0] },
  blanco: { hex: "#FFFFFF", rgb: [255, 255, 255] },
  rojo: { hex: "#FF0000", rgb: [255, 0, 0] },
  azul: { hex: "#3167b7", rgb: [49, 103, 183] },
  azulOscuro: { hex: "#063888", rgb: [6, 56, 136] },
  azulMarino: { hex: "#023b8e", rgb: [2, 59, 142] },
  verde: { hex: "#28A745", rgb: [40, 167, 69] },
  aguamarina: { hex: "#239699", rgb: [35, 150, 153] },
  amarillo: { hex: "#FFC107", rgb: [255, 193, 7] },
  gris: { hex: "#6C757D", rgb: [108, 117, 125] },
  violeta: { hex: "#6d1e87", rgb: [109, 30, 135] },
  morado: { hex: "#6F42C1", rgb: [111, 66, 193] },
  purpura: { hex: "#6F42C1", rgb: [111, 66, 193] },
  rosado: { hex: "#E83E8C", rgb: [232, 62, 140] },
  rosa: { hex: "#E83E8C", rgb: [232, 62, 140] },
  naranja: { hex: "#FD7E14", rgb: [253, 126, 20] },
  dorado: { hex: "#DAA520", rgb: [218, 165, 32] },
  plateado: { hex: "#C0C0C0", rgb: [192, 192, 192] },
  teal: { hex: "#008B8B", rgb: [0, 139, 139] },
  turquesa: { hex: "#40E0D0", rgb: [64, 224, 208] },
  cyan: { hex: "#00FFFF", rgb: [0, 255, 255] },
  cian: { hex: "#00FFFF", rgb: [0, 255, 255] },
  mint: { hex: "#3EB489", rgb: [62, 180, 137] },
  cafe: { hex: "#8B4513", rgb: [139, 69, 19] },
  marron: { hex: "#8B4513", rgb: [139, 69, 19] },
};

// Alias para variaciones de colores
const colorAliases = {
  "azul cielo": "azul",
  "azul claro": "azul",
  "azul rey": "azul",
  "azul electrico": "azul",
  "azul marino": "azulOscuro",
  "azul oscuro": "azulOscuro",
  "navy": "azulOscuro",
};

const normalizeColor = (c) => {
  if (!c) return "";
  let normalized = c.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (colorAliases[normalized]) {
    return colorAliases[normalized];
  }
  return normalized;
};

export const DetailProductScreen = ({
  user_id,
  product_id,
  price,
  quantity,
}) => {
  const { id } = useParams();
  const location = useLocation();
  const showLocation = useLocation();
  const product = useSelector((state) => state.product.selectedProduct);
  const productHover = useSelector((state) => state.product.selectedProduct);
  const ratings = useSelector((state) => state.product.ratings);
  const user = useSelector((state) => state.auth.user);
  const { formRefs, validateForm } = useValidations();
  const [guestUser, setGuestUser] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [colorImageMap, setColorImageMap] = useState({});
  const [mapReady, setMapReady] = useState(false);
  const { slugify } = useSlugify();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allProducts = useSelector((state) => state.product.productInfo);
  const productFromStore = useSelector(
    (state) => state.product.selectedProduct,
  );

  const initialForm = {
    user_id: "",
    product_id: "",
    price: "",
    quantity: "",
  };

  useEffect(() => {
    scrollTop();
  }, []);

  // ── Construir el mapa color→imagen analizando cada imagen ────────────────
  useEffect(() => {
    const currentProduct = product || productFromStore;
    if (!currentProduct?.images?.length || !currentProduct?.colors?.length) {
      setMapReady(true);
      return;
    }

    const buildMap = async () => {
      // Crear mapa de colores disponibles
      const availableColors = {};
      currentProduct.colors.forEach(colorName => {
        const normalized = normalizeColor(colorName);
        let colorData = colorMapExact[normalized];
        
        if (!colorData) {
          const similarKey = Object.keys(colorMapExact).find(key => 
            key.includes(normalized) || normalized.includes(key)
          );
          if (similarKey) {
            colorData = colorMapExact[similarKey];
          }
        }
        
        if (colorData) {
          availableColors[normalized] = {
            name: colorName,
            rgb: colorData.rgb,
            hex: colorData.hex
          };
        } else {
          availableColors[normalized] = {
            name: colorName,
            rgb: [128, 128, 128],
            hex: "#888888"
          };
        }
      });

      const map = {};

      // Para cada imagen, encontrar el color más cercano
      const imagePromises = currentProduct.images.map(async (imgSrc, index) => {
        try {
          const dominantRgb = await getDominantColor(imgSrc);
          
          let bestColor = null;
          let bestDistance = Infinity;

          for (const [colorKey, colorValue] of Object.entries(availableColors)) {
            const distance = colorDistance(dominantRgb, colorValue.rgb);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestColor = colorKey;
            }
          }

          const THRESHOLD = bestColor?.includes("azul") ? 150 : 100;
          
          if (bestColor && bestDistance < THRESHOLD) {
            return { bestColor, imgSrc };
          }
        } catch (err) {
          console.warn(`Error procesando imagen ${index}:`, err);
        }
        return null;
      });

      const results = await Promise.all(imagePromises);
      
      for (const result of results) {
        if (result && !map[result.bestColor]) {
          map[result.bestColor] = result.imgSrc;
        }
      }

      // Si hay colores sin imagen asignada, asignar por orden
      if (currentProduct.colors.length > 0 && Object.keys(map).length < currentProduct.colors.length) {
        let imageIndex = 0;
        for (const colorName of currentProduct.colors) {
          const normalized = normalizeColor(colorName);
          if (!map[normalized] && currentProduct.images[imageIndex]) {
            map[normalized] = currentProduct.images[imageIndex];
            imageIndex++;
          }
        }
      }

      setColorImageMap(map);
      setMapReady(true);
      
      console.log("Color-Image Map DetailScreen:", map);
    };

    buildMap();
  }, [product, productFromStore]);

  useEffect(() => {
    if (!id || !Array.isArray(allProducts)) return;

    const numericId = Number(id);

    if (isNaN(numericId)) {
      console.error("ID inválido:", id);
      return;
    }

    if (productFromStore?.id === numericId) return;

    const foundProduct = allProducts.find((p) => p.id === numericId);

    if (foundProduct) {
      dispatch(selectedProduct(foundProduct));
    } else {
      console.error("Producto no encontrado con id:", numericId);
    }
  }, [id, allProducts]);

  useEffect(() => {
    if (!user) {
      try {
        let guestId = localStorage.getItem("guest_id");

        if (!guestId) {
          guestId = crypto.randomUUID();
          localStorage.setItem("guest_id", guestId);
        }

        const guestUser = {
          id: guestId,
          name: "Invitado",
          role: "guest",
          guest: true,
        };

        localStorage.setItem("guestUser", JSON.stringify(guestUser));
        setGuestUser(guestUser);
      } catch (error) {
        console.error("Error guest:", error);
      }
    } else {
      setGuestUser(null);
    }
  }, [user]);

  useEffect(() => {
    if (!product) {
      const stored = localStorage.getItem("selectedProduct");
      if (stored) {
        const parsed = JSON.parse(stored);
      }
    }
  }, [product]);

  const {
    form,
    errors,
    handleChangeProduct,
    handleSubmitAddCart,
    handleSubmitAddWishlist,
    setForm,
  } = useForm(initialForm, validateForm);

  const handleSetProductInfo = () => {
    if (!user || !productHover) return;

    dispatch(selectedProduct(productHover));
    localStorage.setItem("productHover", JSON.stringify(productHover));

    setForm({
      user_id: user.id,
      product_id: productHover.id,
      price: productHover.price,
      img: productHover.images,
      quantity: 1,
    });
  };

  const handleCLearProduct = () => {
    dispatch(clearProduct(productHover));
    localStorage.removeItem("productHover", productHover);
    setForm(initialForm);
  };

  const handleCheckoutClick = () => {
    const currentProduct = product || productFromStore;

    if (!currentProduct) return;

    const guest = guestUser || JSON.parse(localStorage.getItem("guestUser"));

    if (!user && !guest) return;

    const checkoutData = {
      guest: !user,
      user: user || guest,
      products: [
        {
          product_id: currentProduct.id,
          name: currentProduct.name,
          price: currentProduct.price,
          quantity: 1,
          img: Array.isArray(currentProduct.images)
            ? currentProduct.images[0]
            : currentProduct.images || currentProduct.image || "",
          color: activeColor,
        },
      ],
    };

    localStorage.setItem("checkout_data", JSON.stringify(checkoutData));

    const url = `/products/${slugify(currentProduct.name)}/checkout`;

    if (user) {
      navigate(url, { state: checkoutData });
      return;
    }

    Swal.fire({
      title: "Comprar como invitado",
      text: "Estás comprando como usuario invitado.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      customClass: {
        popup: "swal-custom-popup",
        title: "swal-custom-title",
        content: "swal-custom-content",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(url, { state: checkoutData });
      }
    });
  };

  const handleMouseEnter = () => {
    if (user) {
      handleSetProductInfo({ user_id, product_id, price, quantity });
    }
  };

  const handleMouseLeave = () => {
    if (user) {
      handleCLearProduct({ user_id, product_id, price, quantity });
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    
    const currentProduct = product || productFromStore;
    
    if (currentProduct?.colors?.length > 0 && !activeColor) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona un color",
        text: "Debes elegir un color antes de agregar al carrito",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
          cancelButton: "swal-cancel-btn",
        },
      });
      return;
    }

    const productData = {
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      previousPrice: currentProduct.previousPrice,
      img_url: currentProduct.images,
      color: activeColor,
    };

    handleSubmitAddCart(productData);
  };

  const handleAddToWishList = (e) => {
    if (user) {
      handleSubmitAddWishlist(e);
    } else {
      Swal.fire({
        title: "Aún no eres nuestro cliente",
        text: "Regístrate para agregar productos a la lista de deseos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Registrarme",
        cancelButtonText: "Cancelar",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
          cancelButton: "swal-cancel-btn",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/auth/register");
        }
      });
    }
  };

  // Mapa de colores para mostrar (solo hex para UI)
  const colorDisplayMap = {
    negro: "#000000",
    blanco: "#FFFFFF",
    rojo: "#FF0000",
    azul: "#3167b7",
    verde: "#28A745",
    amarillo: "#FFC107",
    gris: "#6C757D",
    violeta: "#6F42C1",
    rosado: "#E83E8C",
    naranja: "#FD7E14",
    dorado: "#DAA520",
    plateado: "#C0C0C0",
  };

  const currentProduct = product || productFromStore;

  return (
    <DetailProduct>
      <section className="detailproduct">
        <span>{`home > products > ${currentProduct?.name || ""}`}</span>
        <div className="detailproduct-containerr">
          <div className="detailproduct-contain">
            <div id="swiper-container">
              <Slider
                activeColor={activeColor}
                colorImageMap={colorImageMap}
                normalizeColor={normalizeColor} 
              />
            </div>
          </div>
          <div className="detailproduct-contain scroll">
            <div className="detailproduct-contain-box">
              <h2>${formatPrice(currentProduct?.price)}</h2>
              <h3 className="detailproduct__prevprice">
                ${formatPrice(currentProduct?.previousPrice)}
              </h3>
            </div>
            <div className="detailproduct-contain-box">
              <h2>{currentProduct?.name}</h2>
              <div className="detailproduct-contain-info">
                <Rating
                  ratings={ratings}
                  productID={currentProduct?.id}
                  userID={user ? user.id : null}
                />
              </div>
              <div className="">
                <h2>Descripción</h2>
                <p>{currentProduct?.description}</p>
              </div>
              {currentProduct?.colors && currentProduct.colors.length > 0 && (
                <div style={{ marginTop: "15px" }}>
                  <h3>Colores disponibles</h3>

                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "8px", flexWrap: "wrap" }}>
                    {currentProduct.colors.map((colorItem, index) => {
                      const normalized = normalizeColor(colorItem);
                      const colorData = colorMapExact[normalized];
                      const bgColor = colorData?.hex || colorDisplayMap[normalized] || colorItem || "#ccc";
                      const isActive =
  normalizeColor(activeColor) === normalizeColor(colorItem);
                      const hasImage = !!colorImageMap[normalized];

                      return (
                        <div
                          key={index}
                          onClick={() => hasImage && setActiveColor(colorItem)}
                          title={hasImage ? colorItem : `${colorItem} (sin imagen)`}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: bgColor,
                            border: isActive
                              ? "3px solid #000"
                              : "2px solid #ddd",
                            cursor: hasImage ? "pointer" : "not-allowed",
                            transform: isActive ? "scale(1.1)" : "scale(1)",
                            transition: "0.2s",
                            opacity: hasImage ? 1 : 0.5,
                            position: "relative",
                          }}
                        >
                          {!hasImage && (
                            <span style={{
                              position: "absolute",
                              top: "-5px",
                              right: "-5px",
                              background: "#ff4444",
                              color: "white",
                              borderRadius: "50%",
                              width: "14px",
                              height: "14px",
                              fontSize: "9px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}>
                              !
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {!mapReady && (
                    <p style={{ fontSize: 11, color: "#aaa", marginTop: 8 }}>
                      Cargando colores...
                    </p>
                  )}
                </div>
              )}
              <div className="">
                <h2>Product testimonials</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Inventore id voluptate totam asperiores! Voluptas, eos
                  recusandae. Alias, tenetur blanditiis. Voluptatum, possimus
                  cumque aperiam aut velit odit labore laboriosam iste officiis.
                </p>
              </div>
            </div>
          </div>
          <div className="detailproduct-contain-box">
            <div>
              <h3>Product services</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore id voluptate totam asperiores! Voluptas, eos
                recusandae. Alias, tenetur blanditiis. Voluptatum, possimus
                cumque aperiam aut velit odit labore laboriosam iste officiis.
              </p>
              <div className="detailproduct-contain-btns">
                <BaseButton
                  classs={"button primary"}
                  $colorbtn={"var(--danger)"}
                  $colortextbtnprimary={"var(--light)"}
                  $colorbtnhoverprimary={"var(--bg-primary-tr)"}
                  $colortextbtnhoverprimary={"var(--light)"}
                  img={true}
                  icon={"pay"}
                  handleClick={handleCheckoutClick}
                  label={"Comprar"}
                  textLabel={true}
                />

                <BaseButton
                  img={true}
                  icon={"addcart-red"}
                  textLabel={true}
                  classs={"button primary"}
                  $colorbtn={"var(--primary)"}
                  $colortextbtnprimary={"var(--light)"}
                  $colorbtnhoverprimary={"var(--bg-primary-tr)"}
                  $colortextbtnhoverprimary={"var(--light)"}
                  label={"Agregar al carrito"}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  handleClick={handleAddToCart}
                  onSubmit={handleAddToCart}
                />
                <div className="detailproduct-contain-group">
                  <BaseButton
                    img={true}
                    icon={"share-red"}
                    classs={"button primary"}
                    $colorbtn={"var(--success)"}
                    $colortextbtnprimary={"var(--light)"}
                    $colorbtnhoverprimary={"var(--bg-primary-tr)"}
                    $colortextbtnhoverprimary={"var(--light)"}
                    textLabel={true}
                    label={"Compartir"}
                  />
                  <BaseButton
                    img={true}
                    icon={"addwishlist"}
                    classs={"button primary"}
                    $colorbtn={"var(--dark)"}
                    $colortextbtnprimary={"var(--light)"}
                    $colorbtnhoverprimary={"var(--bg-primary-tr)"}
                    $colortextbtnhoverprimary={"var(--light)"}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    handleClick={handleAddToWishList}
                    onSubmit={handleAddToWishList}
                  />
                </div>
              </div>
            </div>
            <form encType="multipart/form-data">
              <div>
                <input
                  id="user_id"
                  name="user_id"
                  type="text"
                  value={form.user_id}
                  onChange={handleChangeProduct}
                />
                {errors.user_id && (
                  <p className="warnings-form">{errors.user_id}</p>
                )}
              </div>
              <div>
                <input
                  id="product_id"
                  name="product_id"
                  type="text"
                  value={form.product_id}
                  onChange={handleChangeProduct}
                />
                {errors.product_id && (
                  <p className="warnings-form">{errors.product_id}</p>
                )}
              </div>
              <div>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={form.price}
                  onChange={handleChangeProduct}
                />
                {errors.price && (
                  <p className="warnings-form">{errors.price}</p>
                )}
              </div>
              <div>
                <input
                  id="quantity"
                  name="quantity"
                  type="text"
                  value={form.quantity}
                  onChange={handleChangeProduct}
                />
                {errors.quantity && (
                  <p className="warnings-form">{errors.quantity}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </DetailProduct>
  );
};

const DetailProduct = styled.section`
  @keyframes fades {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .detailproduct {
    animation: fades 0.5s ease backwards;
    display: grid;
    padding: 12px;
    gap: 10px;
    @media (max-width: 720px) {
      overflow-y: scroll;
      padding: 12px;
      gap: 15px;
    }
    &__prevprice {
      color: #ec3337;
      font-weight: 500;
      text-decoration: line-through;
      font-size: 17px;
    }
    &-containerr {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: 40% 40% 1fr;
      gap: 13px;

      @media (max-width: 720px) {
        grid-template-columns: 1fr;
        height: fit-content;
      }
    }
    &-contain {
      align-content: start;
      align-items: start;
      justify-content: start;
      display: grid;
      gap: 6px;
      margin: 0;
      height: 100%;
      @media (max-width: 720px) {
        height: 100%;
      }

      &-box {
        display: grid;
        word-break: break-all;
        /* border: #ec3337 1px solid; */

        margin: 0;
        padding: 0 10px;
        gap: 15px;
      }
      &-btns {
        display: grid;
        gap: 5px;
      }
      &-group {
        display: grid;
        grid-template-columns: 70% 30%;
        height: 100%;
        gap: 5px;
      }
      &-info {
        display: flex;

        h2 {
          font-size: 18px;
          font-weight: 600;
        }
      }
      &.scroll {
        overflow-y: scroll;
        &::-webkit-scrollbar {
          width: 10px;
          height: 30px;
          margin: 1px;
          background: rgba(128, 128, 128, 0.242);
          border-radius: 10px;
        }
        &::-webkit-scrollbar-track {
          width: 7px;
          height: 50px;
        }
        &::-webkit-scrollbar-thumb {
          background: rgba(22, 21, 21, 0.091);
          width: 5px;
          border-radius: 10px;
          border: rgba(128, 128, 128, 0.295) 1px solid;
          height: 30px;
        }
        &::-webkit-scrollbar-track-piece {
          background: rgba(128, 128, 128, 0.005);
          border-radius: 10px;
          width: 10px;
          height: 10px;
        }
      }
    }
    form {
      display: none;
    }
  }
`;
