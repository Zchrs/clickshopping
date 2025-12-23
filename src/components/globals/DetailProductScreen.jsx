/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux';
import { Slider } from './Slider';
import { Rating } from './Rating';
import { BaseButton } from './BaseButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatPrice, scrollTop } from '../../../globalActions';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import { useEffect } from 'react';
import { clearProduct, selectedProduct } from '../../actions/productActions';
import { initialAddCartForm, useForm } from '../../hooks/useForm';

export const DetailProductScreen = ({
  user_id, 
  product_id, 
  price, 
  quantity
}) => {
  const location = useLocation();
  const showLocation = useLocation();
  const product = useSelector((state) => state.product.selectedProduct);
  const productHover = useSelector((state) => state.product.selectedProduct);
  const ratings = useSelector((state) => state.product.ratings);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log(product)
  useEffect(() => {
    scrollTop();
  }, [])
  
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


  const handleSetProductInfo = () => {
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


  const handleCheckoutClick = () => {
    if (user) {
      navigate(`checkout`);
    } else {
      Swal.fire({
        title: 'Regístrate',
        text: 'Debes ser cliente registrado para comprar',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Quiero registrarme',
        cancelButtonText: 'Volver',
        background: '#f0f0f0',
        customClass: {
          popup: 'custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'custom-confirm-button-register',
          cancelButton: 'custom-cancel-button-register',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/users/auth/register');
        }else{
          return
        }
      
       })
  }
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

  return (
    <DetailProduct>
      <section className="detailproduct">
        <span>{`home${showLocation.pathname.replace(/\//g, ' > ')}`}</span>
        <div className="detailproduct-containerr">
          <div className="detailproduct-contain">
            <div id='swiper-container'>
                <Slider />
            </div>
          </div>
          <div className="detailproduct-contain scroll">
            <div className="detailproduct-contain-box">
      
            <h2>${ formatPrice(product.price) }</h2>
              <h3 className='detailproduct__prevprice'>${ formatPrice(product.previousPrice) }</h3>
            </div>
            <div className="detailproduct-contain-box">
              <h2>{ product.name }</h2>
              <div className="detailproduct-contain-info">
              <Rating ratings={ratings} productID={product.id} userID={user ? user.id : null} />
              </div>
            <div className="detailproduct-contain-box">
              <h2>Product testimonials</h2>
              <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
               Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut
               velit odit labore laboriosam iste officiis.
              </p>
            </div>
            <div className="detailproduct-contain-box">
              <h2>Descripción</h2>
              <p>
              { product.description }
              </p>
            </div>
            </div>
          </div>
          <div className="detailproduct-contain-box">
            <div>
              <h3>Product services</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore id voluptate totam asperiores! Voluptas, eos recusandae.
                Alias, tenetur blanditiis. Voluptatum, possimus cumque aperiam aut velit
                odit labore laboriosam iste officiis.
              </p>
              <div className="detailproduct-contain-btns">
                  <BaseButton
                          classs={'button primary'} 
        colorbtn={"var(--danger)"}
        colortextbtnprimary={"var(--light)"}
        colorbtnhoverprimary={"var(--bg-primary-tr)"}
        colortextbtnhoverprimary={"var(--light)"}
                  img={true}
                  icon={"whatsapp-grey"}
                  handleClick={handleCheckoutClick}
                  label={"Lo quiero!"}
                  textLabel={true}
                  />
      
                  <BaseButton 
                    img={true} 
                    icon={"addcart-red"} 
                    textLabel={true} 
                            classs={'button primary'} 
        colorbtn={"var(--primary)"}
        colortextbtnprimary={"var(--light)"}
        colorbtnhoverprimary={"var(--bg-primary-tr)"}
        colortextbtnhoverprimary={"var(--light)"}
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
                            classs={'button primary'} 
        colorbtn={"var(--success)"}
        colortextbtnprimary={"var(--light)"}
        colorbtnhoverprimary={"var(--bg-primary-tr)"}
        colortextbtnhoverprimary={"var(--light)"}
                    textLabel={true} 
                    label={"Compartir"} 
                  />
                  <BaseButton 
                    img={true} 
                    icon={"addwishlist"} 
                            classs={'button primary'} 
        colorbtn={"var(--dark)"}
        colortextbtnprimary={"var(--light)"}
        colorbtnhoverprimary={"var(--bg-primary-tr)"}
        colortextbtnhoverprimary={"var(--light)"}
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
              <input id="user_id" name="user_id" type="text" value={formCart.user_id} onChange={handleChangeProduct} />
              {errors.user_id && <p className="warnings-form">{errors.user_id}</p>}
            </div>
            <div>
              <input id="product_id" name="product_id" type="text" value={formCart.product_id} onChange={handleChangeProduct} />
              {errors.product_id && <p className="warnings-form">{errors.product_id}</p>}
            </div>
            <div>
              <input id="price" name="price" type="text" value={formCart.price} onChange={handleChangeProduct} />
              {errors.price && <p className="warnings-form">{errors.price}</p>}
            </div>
            <div>
              <input id="quantity" name="quantity" type="text" value={formCart.quantity} onChange={handleChangeProduct} />
              {errors.quantity && <p className="warnings-form">{errors.quantity}</p>}
            </div>
            
          </form>
          </div>
        </div>
      </section>
    </DetailProduct>
  )
}




const DetailProduct = styled.section`
@keyframes fades {
    from{
       opacity: 0;
    }
    to{
        opacity: 1;
    }
}
.detailproduct{
    animation: fades .5s ease backwards;
    display: grid;
    padding: 12px;
    gap: 25px;
    @media (max-width: 720px) {
        overflow-y: scroll;
        padding: 12px;
        gap: 15px;
    }
    &__prevprice{
        color: #EC3337;
        font-weight: 500;
        text-decoration:line-through;
        font-size: 17px;
    }
    &-containerr{
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
    &-contain{
      align-items: start;
      justify-content: start;
        display: grid;
        gap: 6px;
        margin: 0;
        height: 100%;
        @media (max-width: 720px) {
            height: 100%;
        }

        &-box{
            display: grid;
            margin: 0;
            padding: 0;
            gap: 6px;
        }
        &-btns{
            display: grid;
            gap: 5px;
        }
        &-group{
            display: grid;
            grid-template-columns: 70% 30%;
            height: 100%;
            gap: 5px;
        }
        &-info{
            display: flex;
            
            h2{
                font-size: 18px;
                font-weight: 600;
            }
        }
        &.scroll{
            
            overflow-y: scroll;
            &::-webkit-scrollbar{
                width: 10px;
                height: 30px;
                margin: 1px;
                background: rgba(128, 128, 128, 0.242);
                border-radius: 10px;
            }
            &::-webkit-scrollbar-track{
                width: 7px;
                height: 50px;
            }
            &::-webkit-scrollbar-thumb{
                background: rgba(22, 21, 21, 0.091);
                width: 5px;
                border-radius: 10px;
                border: rgba(128, 128, 128, 0.295) 1px solid;
                height: 30px;
            }
            &::-webkit-scrollbar-track-piece{
                background: rgba(128, 128, 128, 0.005);
                border-radius: 10px;
                width: 10px;
                height: 10px;
            }
        }
    }
    form{
      display: none;
    }
}
`