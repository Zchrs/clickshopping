/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import { getFile } from "../../reducers/globalReducer";
import { useState } from "react";
import { Modal } from "./Modal";
import { Rating } from "./Rating";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setProduct } from '../../actions/productActions';


import "../../assets/sass/cardproducts.scss";
import AddToCart from "./AddToCart";
import { formatPrice } from "../../../globalActions";
export const CardProductsSmall = ({
  title,
  // productInfo,
  description,
  productLink,
  memberDiscount,
  thumbnails,
  img,
  img2,
  img3,
  price,
  previousPrice,
  discount,
  addToWish,
  prodHover,
product_id,
ratingss,
ratings,
  premiumText,
  descriptionText,
  addCartBox,
  addWishBox,
  tittleText,
  priceText,
  groupBox,
  sellingsText,
  sellings,
  onClick,
  png,
  jpg,
  jpg2,
  jpg3,
}) => {
  const [modal, setModal] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const scrollTop = () =>{
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // const handleOpenModal = () => {
  //   setModal(true);
  // };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setModal(false);
    console.log("click");
  };
  

  const dispatch = useDispatch();

  // Cuando quieras establecer el estado del producto
  const handleSetProductInfo = () => {
    // debugger
    const productInfo = {
      title,
      description,
      productLink,
      img,
      price,
      previousPrice,
      thumbnails,
    }
    
      dispatch(setProduct(productInfo));
      localStorage.setItem('product', productInfo);
      // console.log(productInfo)
    };
    

  
  const handleFunctions = () => {
    
    scrollTop(),
    handleSetProductInfo()
  }

  return (
    <section className="productcard">
      {addWishBox && (
        <div className="productcard-addwishimg">
          <img
            loading="lazy"
            src={getFile("svg", `${addToWish}`, "svg")}
            alt=""
          />
        </div>
      )}
      {addCartBox && (
        <div className="productcard-addcartimg">
          <AddToCart />
        </div>
      )}
      <Link onMouseEnter={prodHover} onClick={onClick} to={productLink}>
        <div className="productcard-contain">
          {png && (
            <img
              loading="lazy"
              src={img}
              alt=""
            />
          )}
          {jpg3 && (
            <img
              loading="lazy"
              src={img3}
              alt=""
            />
          )}
          {jpg2 && (
            <img
              loading="lazy"
              src={img2}
              alt=""
            />
          )}
          {jpg && (
            <img loading="lazy" src={img} alt="" />
          )}
        </div>
      </Link>
      <div className="productcard-box">
        {descriptionText && <p className="productcard__p"> {description} </p>}
        {tittleText && <p className="productcard__p"> {title} </p>}
        {priceText && <h2 className="productcard__h2"> ${formatPrice(price)} </h2>}
        {sellingsText && (
          <p className="productcard__p productcard__selltext"> {sellings} 999</p>
        )}
        {groupBox && (
          <div className="productcard-group">
            <p className="product__p2">
              {previousPrice}
              <span style={{ color: "#EC3337" }}> {discount} </span>
            </p>
          </div>
        )}
        {premiumText && <p className="productcard__p3"> {memberDiscount} </p>}
        <div>
        {ratingss && <Rating ratings={ratings} productID={product_id} userID={user ? user.id : null} />}
        </div>
      </div>
      {modal && (
        <Modal
          title="Título del Modal"
          img="nombre_de_la_imagen"
          click={handleCloseModal}
        />
      )}
    </section>
  );
};
