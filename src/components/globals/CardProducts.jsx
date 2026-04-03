/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { formatPrice } from "../../../globalActions";
import styled from "styled-components";
import { BaseButton } from "./BaseButton";
import { useDispatch, useSelector } from "react-redux";
import { clearProduct, selectedProduct } from "../../actions/productActions";
import { AddCartWishlist } from "./AddCartWishlist";
import { Link, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Swal from "sweetalert2";
import { useForm } from "../../hooks/useForm";


import { Rating } from "./Rating";
import { DetailProductSwal } from "./DetailProductSwal";
import { useState } from "react";

export const CardProducts = ({
  title,
  classs,
  description,
  member,
  img,
  images,
  user_id,
  product_id,
  prodHover,
  colors,
  descriptionText,
  prodLeave,
  preview,
  price,
  previousPrice,
  discount,
  productLink,
  onClick,
  quantity,
  ratingss,
  ratings,
  jpg,
  buyCr,
  buy,
}) => {
  const user = useSelector((state) => state.auth.user);
  const productHover = useSelector((state) => state.product.selectedProduct);
    const [activeColor, setActiveColor] = useState(null);
  const isProduction = import.meta.env.MODE === "production";
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const initialForm = {
    user_id: "",
    product_id: "",
    price: "",
    colors: "",
    quantity: "",
  };
  
  const {
    form,
    errors,
    handleChangeProduct,
    handleSubmitAddCart,
    handleSubmitAddWishlist,
    setForm
  } = useForm(initialForm);


  // modal de descripción y seleccion de colores
  const showProductModal = async (product) => {
  let selectedColor = null;
  let root = null;

  await Swal.fire({
    html: `<div id="swal-product-root"></div>`,
    showConfirmButton: false,
    showCloseButton: true,
    width: "100%",
        customClass: {
          popup: "swal-custom-popup",
          title: "swal-custom-title",
          content: "swal-custom-content",
        },
    didOpen: () => {
      const container = document.getElementById("swal-product-root");
      root = ReactDOM.createRoot(container);

      root.render(
        <DetailProductSwal
          product={product}
          onConfirm={(color) => {
            if (product.colors?.length > 1 && !color) {
              Swal.showValidationMessage("Selecciona un color");
              return;
            }

            selectedColor = color;
            Swal.close();
          }}
        />
      );
    },
    didClose: () => {
      if (root) root.unmount(); // 🔥 evitar memory leak
    },
  });

  return selectedColor;
};

  // Cuando quieras establecer el estado del producto
  const handleSetProductInfo = (e) => {
    // console.log(productHover, 'producto seteado')
    if(!user) return
    
    dispatch(selectedProduct(productHover));
    localStorage.setItem("productHover", productHover);
    setForm((prevFormCart) => ({
      ...prevFormCart,
      user_id: user.id, // Assuming you want to set the user_id as well
      product_id: productHover.id,
      price: productHover.price,
      colors: productHover.colors,
      quantity: 1, // You can set a default quantity or manage it as needed
    }));
  };
  
  const handleCLearProduct = () => {

    // console.log(productHover, 'producto quitado')
    dispatch(clearProduct(productHover));
    localStorage.removeItem("productHover", productHover);
    setForm(initialForm);
  };

  const handleMouseEnter = () => {
    if (user) {
      handleSetProductInfo({ user_id, product_id, price, colors, quantity });
    }
  };

  const handleMouseLeave = () => {
    if (user) {
      handleCLearProduct({ user_id, product_id, price, colors, quantity });
    }
  };

const handleAddToCart = async (e) => {
  e.preventDefault();

const productData = {
  id: product_id,
  name: title,
  price: price,
  previousPrice: previousPrice,
  images: images?.length ? images : [img], // ✅ FIX REAL
  img_url: img, // 🔥 FIX
  description: descriptionText,
  colors: colors,
};

  const hasMultipleColors =
    Array.isArray(colors) && colors.length > 1;

  let selectedColor = activeColor;

  // ✅ SI TIENE VARIOS COLORES → ABRIR MODAL
  if (hasMultipleColors && !selectedColor) {
    selectedColor = await showProductModal(productData);

    if (!selectedColor) return; // usuario canceló
  }

  // ✅ SI SOLO HAY UN COLOR → AUTOSELECCIÓN
  if (!hasMultipleColors && colors?.length === 1) {
    selectedColor = colors[0];
  }

  // 🔥 GUARDAR COLOR EN ESTADO (opcional)
  setActiveColor(selectedColor);

  // ✅ ENVIAR AL HOOK
  handleSubmitAddCart(productData, 1, selectedColor);
};

  const handleAddToWishList = (e) => {
    if (user) {
      handleSubmitAddWishlist(e);
    } else {
      Swal.fire({
        title: "Debes registrarte",
        text: "Regístrate para agregar productos a la lista de deseos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Registrarme",
        cancelButtonText: "Cancelar",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "swal-custom-title",
          content: "swal-custom-content",
          confirmButton: "swal-confirm-btn",
          cancelButton: "swal-cancel-btn",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/users/auth/register");
        }
      });
    }
  };

  const whatsapp = () => {
     window.open(`https://wa.me/message/WUYQ32XZFQ7TG1`, '_blank')
  } 


  return (
    <ProductCard onMouseEnter={prodHover}>
      <section className={classs}>
        <div>
          <div className="productcard-addwish">
            <AddCartWishlist
              addWish={true}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onclick={handleAddToWishList}
              onSubmit={handleAddToWishList}
            />
          </div>
          <div className="productcard-addcart">
            <AddCartWishlist
              addCart={true}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onclick={handleAddToCart}
              onSubmit={handleAddToCart}
            />
          </div>
          <div className="productcard-contain">
             {!isProduction ? (
    // 🧪 DESARROLLO → imagen local
    <Link onMouseEnter={prodHover} onClick={onClick} to={productLink}>
      <img
        loading="lazy"
        src={img}
        alt={title}
      />
    </Link>
  ) : (
      <Link>
        <img
            loading="lazy"
            src={img}
            alt={title}
            onError={(e) => {
            e.target.src = "/img/no-image.png";
            }}
          />
      </Link>
  )}
          </div>
        </div>
        <div className="productcard-box">
          {buy && (
            <div className="productcard-btn">
              <BaseButton
                img={true}
                icon={"whatsapp-grey"}
                classs={"button full-blue"}
                textLabel={true}
                label={"Lo quiero!"}
                handleClick={whatsapp}
              />
            </div>
          )}
          {buyCr && (<div className="productcard-btn">
            <BaseButton 
              img={true} 
              icon={"wallet"} 
              classs={'button primary'} 
              $colorbtn={"var(--bg-primary)"}
              $colortextbtnprimary={"var(--light)"}
              $colorbtnhoverprimary={"var(--bg-primary-tr)"}
              $colortextbtnhoverprimary={"white"}  
              textLabel={true} 
              label={"Comprar"} />
          </div>)}

          <p className="productcard__p"> {description} </p>
          <p className="productcard__quantity"> {title} </p>
          <p className="productcard__quantity"> {quantity} Disponibles</p>
          <h2 className="productcard__h2">
            {formatPrice(price)}
             <span className="productcard-span"> {discount} </span>
          </h2>
          <div className="productcard-group">
            <p className="productcard__p2">{formatPrice(previousPrice)}</p>
          </div>
          <p className="productcard__p3"> {member} </p>
          {ratingss && <Rating ratings={ratings} productID={product_id} userID={user ? user.id : null} />}
          {preview && (
            <div className="productcard-btn">
              <BaseButton
                img={true}
                classs={"button short-black"}
                link={productLink}
                label={'Previsualizar'}
              />
            </div>
          )}
        </div>
      </section>
    </ProductCard>
  );
};


const ProductCard = styled.div`
display: grid;

  .productcard {
    position: relative;
    display: grid;
    height: 100%;
    border-radius: 8px;
    align-content: space-between;
    gap: 2px;
    padding: 0;
    transition: all ease 0.9s;
    &:hover {
      transform: scale(1.12);
      box-shadow: rgba(128, 128, 128, 0.6) 1px 1px 6px,
        rgba(128, 128, 128, 0.6) -1px -1px 6px;
      z-index: 100;
    }

    &-form{
      display: none;
    }

    &-span {
      color: #990000;
      font-weight: 400;
    }

    &-box {
      display: grid;
      padding: 10px;
      gap: 2px;
      // max-height: 200px;
    }

    &.background {
      background: #f5f1f1;
    }

    &-btn {
      display: grid;
      width: 100%;
      // border: #660000 1px solid;
      margin: 5px 0;

      @media (max-width: 680px) {
        justify-content: center;
      }
    }

    &__p {
      font-size: 15px;
      font-weight: 500;
      padding: 0;
      line-height: 1.1;
      padding-bottom: 5px;
      word-break: break-word;
    }
    &__quantity {
      color: rgb(123, 120, 120);
      font-size: 14px;
      margin: 0;
      padding: 0;
    }
    &__selltext {
      color: rgb(190, 188, 188);
      font-size: 14px;
      margin: 0;
      padding: 0;
    }

    &__p2 {
      grid-column: 2 / 3;
      text-decoration: line-through;
      line-height: 1;
      span {
        color: #990000;
        text-decoration: none;
      }
    }

    &__p3 {
      font-size: 12px;
      color: #ec3337;
      line-height: 1.1;

      @media (max-width: 450px) {
        font-size: 10px;
        color: black;
      }
    }

    &__h2 {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.3;
      margin: 0;
      padding: 2px 0;
    }

    &-contain {
      display: grid;
      margin: 0;
      padding: 0;
      align-items: start;
      overflow: hidden;
      border-radius: 8px 8px 0px 0px;
      
      img {
        border-radius: 0px;
        width: 100%;
        height: 100%;
        object-fit: contain;
        margin: 0;
        padding: 0;
        transition: all ease 0.4s;
        &:hover {
          transform: scale(1.2);
        }
        @media (max-width: 500px) {
          max-height: 250px;
        }
      }
    }
    &-group {
      display: flex;
      gap: 5px;
    }
    &-addwish {
      left: 10px;
      top: 12px;
      position: absolute;
      display: grid;
      width: 40px;
      height: 40px;
      align-items: center;
      transition: all ease 0.3s;
      background: transparent;
    }
    &-addcart {
      right: 10px;
      top: 12px;
      background: transparent;
      position: absolute;
      display: grid;
      width: 40px;
      height: 40px;
      align-items: center;
      transition: all ease 0.3s;
    }
  }
`;
