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
import { useEffect, useState } from "react";
import { clearProduct, selectedProduct } from "../../actions/productActions";
import { useForm } from "../../hooks/useForm";
import { useValidations } from "../../hooks/useValidations";
import { useParams } from "react-router-dom";


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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allProducts = useSelector((state) => state.product.productInfo);
const productFromStore = useSelector(
  (state) => state.product.selectedProduct
);


  const initialForm = {
    user_id: "",
    product_id: "",
    price: "",
    quantity: "",
  };

  

  // console.log(product)
  useEffect(() => {
    scrollTop();
  }, []);

  useEffect(() => {
  if (productFromStore?.id === id) return;

  const foundProduct = allProducts.find(p => p.id === id);

  if (foundProduct) {
    dispatch(selectedProduct(foundProduct));
  }
}, [id, allProducts]);

useEffect(() => {
  if (!user) {
    try {
      const guestData = localStorage.getItem("guestUser");
      console.log("guestData raw:", guestData);
      
      if (guestData) {
        const parsed = JSON.parse(guestData);
        console.log("guestData parsed:", parsed);
        setGuestUser(parsed);
      } else {
        const guestId = localStorage.getItem("guest_id");
        if (guestId) {
          const newGuestUser = {
            id: guestId,
            name: "Invitado",
            role: "guest",
            guest: true
          };
          localStorage.setItem("guestUser", JSON.stringify(newGuestUser));
          setGuestUser(newGuestUser);
        }
      }
    } catch (error) {
      console.error("Error al parsear guestUser de localStorage:", error);
      localStorage.removeItem("guestUser");
    }
  } else {
    setGuestUser(null);
  }
}, [user]);

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
      quantity: 1,
    });
  };

  const handleCLearProduct = () => {
    // console.log(productHover, 'producto quitado')
    dispatch(clearProduct(productHover));
    localStorage.removeItem("productHover", productHover);
    setForm(initialForm);
  };

const handleCheckoutClick = () => {

  const currentProduct = product || productFromStore;

  if (!currentProduct) {
    console.log("Producto aún no cargado");
    return;
  }


  const checkoutData = {
    guest: !user,
    user: user || guestUser.id,
    products: [
      {
        product_id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.previousPrice,
        quantity: 1,
        img: currentProduct.images
      }
    ]
  };

    console.log(currentProduct, "desde currentproduct detail products")
    debugger
  localStorage.setItem("checkout_data", JSON.stringify(checkoutData));

  if (user) {
    navigate(`/products/${currentProduct.id}/checkout`, {
      state: checkoutData
    });
    return;
  }

  Swal.fire({
    title: "Compra como invitado",
    text: "Estás comprando como usuario invitado.",
    icon: "info",
    confirmButtonText: "Continuar",
    showCancelButton: true,
    customClass: {
      popup: "swal-custom-popup",
      title: "custom-title",
      content: "custom-content",
      confirmButton: "swal-confirm-btn",
      cancelButton: "swal-cancel-btn",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      navigate(`/products/${currentProduct.id}/checkout`, {
        state: checkoutData
      });
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

  if (!currentProduct) {
    console.log("Producto aún no cargado");
    return;
  }

  const productData = {
    product_id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.previousPrice,
    quantity: 1,
    img: currentProduct.images
  };

  // usuario logueado
  if (user) {
    handleSubmitAddCart(productData);
    return;
  }

   // ===== LÓGICA PARA INVITADO (LOCALSTORAGE) =====
  
  // Obtener o crear guest_id
  let guestId = localStorage.getItem("guest_id");
  
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("guest_id", guestId);
    
    // También crear/actualizar guestUser
    const newGuestUser = {
      id: guestId,
      name: "Invitado",
      role: "guest",
      guest: true,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("guestUser", JSON.stringify(newGuestUser));
    setGuestUser(newGuestUser);
  }
  
  // Agregar guest_id al producto
 productData.guest_id = guestId;
  
  // Obtener carrito actual
  const existingCart = localStorage.getItem("cart");
  let cart = existingCart ? JSON.parse(existingCart) : [];
  
  // Verificar si el producto ya existe en el carrito
  const existingProductIndex = cart.findIndex(
    item => item.product_id === currentProduct.id && item.guest_id === guestId
  );
  
  if (existingProductIndex !== -1) {
    // Si existe, aumentar cantidad
    cart[existingProductIndex].quantity += 1;
    
    Swal.fire({
      title: "¡Producto actualizado!",
      text: `${currentProduct.name} ahora tiene cantidad ${cart[existingProductIndex].quantity} en tu carrito`,
      icon: "success",
      showConfirmButton: true,
      confirmButtonText: "Ver carrito",
      showCancelButton: true,
      cancelButtonText: "Seguir comprando",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      background: "#f0f0f0",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/dashboard/my-cart"); // Ajusta la ruta según tu app
      }
    });
  } else {
    // Si no existe, agregarlo
    cart.push(productData);
    
    Swal.fire({
      title: "¡Producto agregado!",
      text: `${currentProduct.name} se agregó a tu carrito`,
      icon: "success",
      showConfirmButton: true,
      confirmButtonText: "Ver carrito",
      showCancelButton: true,
      cancelButtonText: "Seguir comprando",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      background: "#f0f0f0",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/dashboard/my-cart"); // Ajusta la ruta según tu app
      }
    });
  }
  
  // Guardar carrito actualizado
  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Opcional: Disparar evento para actualizar contador en otros componentes
  window.dispatchEvent(new Event('storage'));
  
  console.log("Carrito actualizado:", cart);
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

  return (
    <DetailProduct>
      <section className="detailproduct">
        <span>{`home${showLocation.pathname.replace(/\//g, " > ")}`}</span>
        <div className="detailproduct-containerr">
          <div className="detailproduct-contain">
            <div id="swiper-container">
              <Slider />
            </div>
          </div>
          <div className="detailproduct-contain scroll">
            <div className="detailproduct-contain-box">
              <h2>${formatPrice(product.previousPrice)}</h2>
              <h3 className="detailproduct__prevprice">
                ${formatPrice(product.price)}
              </h3>
            </div>
            <div className="detailproduct-contain-box">
              <h2>{product.name}</h2>
              <div className="detailproduct-contain-info">
                <Rating
                  ratings={ratings}
                  productID={product.id}
                  userID={user ? user.id : null}
                />
              </div>
              <div className="">
                <h2>Descripción</h2>
                <p>{product.description}</p>
              </div>
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
    gap: 25px;
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
