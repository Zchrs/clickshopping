/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { formatPrice, getFile, scrollTop } from "../../../globalActions";
import styled from "styled-components";
import { BaseButton } from "./BaseButton";
import { useDispatch, useSelector } from "react-redux";
import { clearProduct, selectedProduct } from "../../actions/productActions";
import { AddCartWishlist } from "./AddCartWishlist";
import { useNavigate } from "react-router-dom";
// import { addToCart as addToCartAction } from "../actions/cartActions";
import Swal from "sweetalert2";
import { useForm, initialAddCartForm } from "../../hooks/useForm";


import { Rating } from "./Rating";

// export const CardProducts = ({
//   name,
//   classs,
//   description,
//   member,
//   img,
//   user_id,
//   product_id,
//   prodHover,
//   prodLeave,
//   preview,
//   price,
//   previousPrice,
//   discount,
//   productLink,
//   thumbnails,
//   quantity,
//   ratings,
//   jpg,
//   jpg1,
//   buy,
// }) => {
//   const user = useSelector((state) => state.auth.user);
//   const productHover = useSelector((state) => state.product.selectedProduct);
  
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const dataFormErrors = (formCart) =>{
//     let user_id = document.getElementById("user_id")
//     let product_id = document.getElementById("product_id")
//     let price = document.getElementById("price")
//     let quantity = document.getElementById("quantity")

//     let data = {};
//     let errors = {};

//     if (!formCart.user_id && formCart.user_id ==! formCart.user_id) {
//       user_id.style.cssText = "box-shadow: red 1px 1px 2px, red -1px -1px 2px";
//       errors.user_id = "no permitido";
//       return
//     }  
  
//     if (!formCart.product_id && formCart.product_id ==! formCart.product_id) {
//       product_id.style.cssText = "box-shadow: red 1px 1px 2px, red -1px -1px 2px";
//       errors.product_id = "no permitido";
//     }  else {
//       product_id.style.cssText = "box-shadow: #34B0BE 1px 1px 2px, #34B0BE -1px -1px 2px;";
//     }
  
//     if (!formCart.price && formCart.price ==! formCart.price) {
//       price.style.cssText = "box-shadow: red 1px 1px 2px, red -1px -1px 2px";
//       errors.price = "no permitido.";
//     } else {
//       price.style.cssText = "box-shadow: #34B0BE 1px 1px 2px, #34B0BE -1px -1px 2px; color: black;";
//     }
  
//     if (!formCart.quantity) {
//       quantity.style.cssText = "box-shadow: red 1px 1px 2px, red -1px -1px 2px";
//       errors.quantity = "no permitido.";
//     }else {
//       quantity.style.cssText = "box-shadow: #34B0BE 1px 1px 2px, #34B0BE -1px -1px 2px;";
//     }
  


//     return errors

//   }
  
//   const {
//     formCart,
//     errors,
//     handleChangeProduct,
//     handleSubmitAddCart,
//     handleSubmitAddWishlist,
//     setFormCart
//   } = useForm(initialAddCartForm, dataFormErrors);
  

//   // Cuando quieras establecer el estado del producto
//   const handleSetProductInfo = (e) => {
//     // console.log(productHover, 'producto seteado')
//     if(!user) return
    
//     dispatch(selectedProduct(productHover));
//     localStorage.setItem("productHover", productHover);
//     setFormCart((prevFormCart) => ({
//       ...prevFormCart,
//       user_id: user.id, // Assuming you want to set the user_id as well
//       product_id: productHover.id,
//       price: productHover.price,
//       quantity: 1, // You can set a default quantity or manage it as needed
//     }));
//   };
  
//   const handleCLearProduct = () => {

//     // console.log(productHover, 'producto quitado')
//     dispatch(clearProduct(productHover));
//     localStorage.removeItem("productHover", productHover);
//     setFormCart(initialAddCartForm);
//   };

//   const handleMouseEnter = () => {
//     if (user) {
//       handleSetProductInfo({ user_id, product_id, price, quantity });
//     }
//   };

//   const handleMouseLeave = () => {
//     if (user) {
//       handleCLearProduct({ user_id, product_id, price, quantity });
//     }
//   };

//   const handleAddToCart = (e) => {
//     if (user) {
//       handleSubmitAddCart(e);
//     } else {
//       Swal.fire({
//         title: "Aún no eres nuestro cliente",
//         text: "Regístrate para agregar productos al carrito.",
//         icon: "warning",
//         showCancelButton: true,
//         // confirmButtonColor: '#990000',
//         // cancelButtonColor: '#a4883e',
//         confirmButtonText: "Registrarme",
//         cancelButtonText: "Cancelar",
//         background: "#f0f0f0",
//         customClass: {
//           popup: "custom-popup",
//           title: "custom-title",
//           content: "custom-content",
//           confirmButton: "custom-confirm-button",
//           cancelButton: "custom-cancel-button",
//         },
//       }).then((result) => {
//         if (result.isConfirmed) {
//           navigate("/users/auth/register");
//         }
//       });
//     }
//   };
//   const handleAddToWishList = (e) => {
//     if (user) {
//       handleSubmitAddWishlist(e);
//     } else {
//       Swal.fire({
//         title: "Aún no eres nuestro cliente",
//         text: "Regístrate para agregar productos a la lista de deseos.",
//         icon: "warning",
//         showCancelButton: true,
//         // confirmButtonColor: '#990000',
//         // cancelButtonColor: '#a4883e',
//         confirmButtonText: "Registrarme",
//         cancelButtonText: "Cancelar",
//         background: "#f0f0f0",
//         customClass: {
//           popup: "custom-popup",
//           title: "custom-title",
//           content: "custom-content",
//           confirmButton: "custom-confirm-button",
//           cancelButton: "custom-cancel-button",
//         },
//       }).then((result) => {
//         if (result.isConfirmed) {
//           navigate("/users/auth/register");
//         }
//       });
//     }
//   };

//   const whatsapp = () => {
//      window.open(`https://wa.me/message/WUYQ32XZFQ7TG1`, '_blank')
//   } 


//   return (
//     <ProductCard onMouseEnter={prodHover}>
//       <section className={classs}>
//         <div>
//           <div className="productcard-addwish">
//             <AddCartWishlist
//               addWish={true}
//               onMouseEnter={handleMouseEnter}
//               onMouseLeave={handleMouseLeave}
//               onclick={handleAddToWishList}
//               onSubmit={handleAddToWishList}
//             />
//           </div>
//           <div className="productcard-addcart">
//             <AddCartWishlist
//               addCart={true}
//               onMouseEnter={handleMouseEnter}
//               onMouseLeave={handleMouseLeave}
//               onclick={handleAddToCart}
//               onSubmit={handleAddToCart}
//             />
//           </div>
//           <div className="productcard-contain">
//           {jpg && (
//               <img loading="lazy" src={img} alt="" />
//             )}
//           </div>
//         </div>
//         <div className="productcard-box">
//           {buy && (
//             <div className="productcard-btn">
//               <BaseButton
//                 img={true}
//                 icon={"whatsapp-grey"}
//                 classs={"button full-blue"}
//                 textLabel={true}
//                 label={"Lo quiero!"}
//                 handleClick={whatsapp}
//               />
//             </div>
//           )}

//           <p className="productcard__p"> {description} </p>
//           <p className="productcard__quantity"> {name} </p>
//           <p className="productcard__quantity"> {quantity} Disponibles</p>
//           <h2 className="productcard__h2">
//             {formatPrice(price)} <span className="productcard-span"> {discount} </span>
//           </h2>
//           <div className="productcard-group">
//             <p className="productcard__p2">{formatPrice(previousPrice)}</p>
//           </div>
//           <p className="productcard__p3"> {member} </p>
//           { ratings && <Rating /> }
//         {preview && (
//             <div className="productcard-btn">
//               <BaseButton
//                 img={true}
//                 classs={"button short-black"}
//                 link={productLink}
//                 label={'Previsualizar'}
//               />
//             </div>
//           )}
//         </div>
//         <div className="productcard-form" >
//           <form encType="multipart/form-data">
//             <div>
//               <input id="user_id" name="user_id" type="text" value={formCart.user_id} onChange={handleChangeProduct} />
//               {errors.user_id && <p className="warnings-form">{errors.user_id}</p>}
//             </div>
//             <div>
//               <input id="product_id" name="product_id" type="text" value={formCart.product_id} onChange={handleChangeProduct} />
//               {errors.product_id && <p className="warnings-form">{errors.product_id}</p>}
//             </div>
//             <div>
//               <input id="price" name="price" type="text" value={formCart.price} onChange={handleChangeProduct} />
//               {errors.price && <p className="warnings-form">{errors.price}</p>}
//             </div>
//             <div>
//               <input id="quantity" name="quantity" type="text" value={formCart.quantity} onChange={handleChangeProduct} />
//               {errors.quantity && <p className="warnings-form">{errors.quantity}</p>}
//             </div>
            
//           </form>
//         </div>
//       </section>
//     </ProductCard>
//   );
// };

export const CardProducts = ({
  name,
  classs,
  description,
  member,
  img,
  user_id,
  product_id,
  prodHover,
  prodLeave,
  preview,
  price,
  previousPrice,
  discount,
  productLink,
  thumbnails,
  quantity,
  ratingss,
  ratings,
  jpg,
  buyCr,
  buy,
}) => {
  const user = useSelector((state) => state.auth.user);
  const productHover = useSelector((state) => state.product.selectedProduct);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dataFormErrors = (formCart) =>{
    let user_id = document.getElementById("user_id")
    let product_id = document.getElementById("product_id")
    let price = document.getElementById("price")
    let quantity = document.getElementById("quantity")

    let data = {};
    let errors = {};

    if (!formCart.user_id && formCart.user_id ==! formCart.user_id) {
      user_id.style.cssText = "box-shadow: red 1px 1px 2px, red -1px -1px 2px";
      errors.user_id = "no permitido";
      return
    }  
  
    if (!formCart.product_id && formCart.product_id ==! formCart.product_id) {
      product_id.style.cssText = "box-shadow: red 1px 1px 2px, red -1px -1px 2px";
      errors.product_id = "no permitido";
    }  else {
      product_id.style.cssText = "box-shadow: #34B0BE 1px 1px 2px, #34B0BE -1px -1px 2px;";
    }
  
    if (!formCart.price && formCart.price ==! formCart.price) {
      price.style.cssText = "box-shadow: red 1px 1px 2px, red -1px -1px 2px";
      errors.price = "no permitido.";
    } else {
      price.style.cssText = "box-shadow: #34B0BE 1px 1px 2px, #34B0BE -1px -1px 2px; color: black;";
    }
  
    if (!formCart.quantity) {
      quantity.style.cssText = "box-shadow: red 1px 1px 2px, red -1px -1px 2px";
      errors.quantity = "no permitido.";
    }else {
      quantity.style.cssText = "box-shadow: #34B0BE 1px 1px 2px, #34B0BE -1px -1px 2px;";
    }
  


    return errors

  }
  
  const {
    formCart,
    errors,
    handleChangeProduct,
    handleSubmitAddCart,
    handleSubmitAddWishlist,
    setFormCart
  } = useForm(initialAddCartForm, dataFormErrors);
  

  // Cuando quieras establecer el estado del producto
  const handleSetProductInfo = (e) => {
    // console.log(productHover, 'producto seteado')
    if(!user) return
    
    dispatch(selectedProduct(productHover));
    localStorage.setItem("productHover", productHover);
    setFormCart((prevFormCart) => ({
      ...prevFormCart,
      user_id: user.id, // Assuming you want to set the user_id as well
      product_id: productHover.id,
      price: productHover.price,
      quantity: 1, // You can set a default quantity or manage it as needed
    }));
  };
  
  const handleCLearProduct = () => {

    // console.log(productHover, 'producto quitado')
    dispatch(clearProduct(productHover));
    localStorage.removeItem("productHover", productHover);
    setFormCart(initialAddCartForm);
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
    if (user) {
      handleSubmitAddCart(e);
    } else {
      Swal.fire({
        title: "Aún no eres nuestro cliente",
        text: "Regístrate para agregar productos al carrito.",
        icon: "warning",
        showCancelButton: true,
        // confirmButtonColor: '#990000',
        // cancelButtonColor: '#a4883e',
        confirmButtonText: "Registrarme",
        cancelButtonText: "Cancelar",
        background: "#f0f0f0",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/users/auth/register");
        }
      });
    }
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
        // confirmButtonColor: '#990000',
        // cancelButtonColor: '#a4883e',
        confirmButtonText: "Registrarme",
        cancelButtonText: "Cancelar",
        background: "#f0f0f0",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
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
            {jpg && <img loading="lazy" src={getFile('img/images', `${img}`, 'jpg')} alt="" />}
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
              colorbtn={"var(--bg-primary)"}
              colortextbtnprimary={"var(--light)"}
              colorbtnhoverprimary={"var(--bg-primary-tr)"}
              colortextbtnhoverprimary={"white"}  
              textLabel={true} 
              label={"Comprar"} />
          </div>)}

          <p className="productcard__p"> {description} </p>
          <p className="productcard__quantity"> {name} </p>
          <p className="productcard__quantity"> {quantity} Disponibles</p>
          <h2 className="productcard__h2">
            {formatPrice(price)} <span className="productcard-span"> {discount} </span>
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
        {/* Resto del código */}
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
    padding: 10px 8px;
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
      grid-column: 1 / 2;
      font-size: 15px;
      font-weight: 500;
      padding: 0;
      line-height: 1.1;
      padding-bottom: 5px;
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
