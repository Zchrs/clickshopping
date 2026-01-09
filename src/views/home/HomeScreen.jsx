/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */

import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { CardProductsSmall } from "../../components/globals/CardProductsSmall";
import Comments from "../../components/globals/Comments";
import { getFile } from "../../reducers/globalReducer";
import { startChecking } from "../../actions/authActions";
import io from "socket.io-client";
import "../home/home.scss";
import { selectedProduct, setProduct } from "../../actions/productActions";

export const HomeScreen = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [cellphoneProducts, setCellphoneProducts] = useState([]);
  const [clothingProducts, setClothingProducts] = useState([]);
  const [laptopProducts, setLaptopProducts] = useState([]);

  console.log(laptopProducts);

  const ratings = useSelector((state) => state.product.ratings);
  const lang = useSelector((state) => state.langUI.lang);

  const fetchProducts = (category) => async (dispatch) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_API_GET_PRODUCTS_CATEGORY
        }?category=${category}`
      );
      const productsComplete = await Promise.all(
        response.data.map(async (productInfo) => {
          try {
            const imagesRes = await axios.get(
              `${import.meta.env.VITE_APP_API_GET_IMAGE_PRODUCTS_URL}/${
                productInfo.id
              }`
            );
            return {
              ...productInfo,
              images: imagesRes.data.images || [],
            };
          } catch (error) {
            console.error(
              `Error al obtener las imágenes para el producto ${productInfo.id}:`,
              error
            );
            return {
              ...productInfo,
              images: [],
            };
          }
        })
      );
      dispatch(setProduct(productsComplete));

      return productsComplete; // Devolvemos los productos aquí
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      dispatch(setProduct([]));
      return []; // Devolvemos un array vacío en caso de error
    }
  };

  useEffect(() => {
    dispatch(startChecking());
    i18n.changeLanguage(lang);

    const socket = io(import.meta.env.VITE_APP_API_WEBSOCKET_URL, {
      cors: true,
    });

    socket.on("connect", () => {
      console.log("Conectado al servidor de WebSocket");
    });

    socket.on("updateProducts", (updatedProducts) => {
      console.log("Productos actualizados:", updatedProducts);
      setProducts(updatedProducts);
    });

    return () => {
      socket.disconnect();
    };
  }, [i18n, lang, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts("Celulares")).then((prods) =>
      setCellphoneProducts(prods)
    );
    dispatch(fetchProducts("Accesorios")).then((prods) =>
      setClothingProducts(prods)
    );
    dispatch(fetchProducts("portatiles")).then((prods) =>
      setLaptopProducts(prods)
    );
  }, [dispatch]);

  const handleSetProductClick = (product) => {
    dispatch(selectedProduct(product));
  };

  return (
    <section className="homescreen">
      <header className="homescreen-header">
        <div className="homescreen-header__contain">
          <div className="homescreen-header__contain-item">
            <img src={getFile("jpg", "laptop-gaming-rog", "jpg")} alt="" />
            <div className="homescreen-titles">
              <h2 className="homescreen__h2">{t("globals.takeLookLaptop")}</h2>
              <p className="homescreen__p2">
                {t("globals.takeLookTechTextLap")}
                <strong className="homescreen__strong">
                  <a className="homescreen-a" href="">
                    {" "}
                    {t("globals.readMore")}
                  </a>
                </strong>
              </p>
            </div>
          </div>
          <div className="homescreen-header__contain-item1">
            <img
              src={getFile("img/images/technology", `phones`, "jpeg")}
              alt=""
            />
            <div className="homescreen-titles-a">
              <h2 className="homescreen__h3">{t("globals.takeLookTech")}</h2>
              <p className="homescreen__p3">
                {t("globals.takeLookTechText")}
                <strong className="homescreen__strong">
                  <a className="homescreen-a" href="">
                    {" "}
                    {t("globals.readMore")}
                  </a>
                </strong>
              </p>
            </div>
          </div>
          <div className="homescreen-header__contain-item2">
            <img src={getFile("img/images", `granos`, "jpg")} alt="" />
            <div className="homescreen-titles-b">
              <h2 className="homescreen__h4">{t("globals.takeLookGrain")}</h2>
              <p className="homescreen__p4">
                {t("globals.takeLookGrainText")}
                <strong className="homescreen__strong">
                  <a className="homescreen-a" href="">
                    {" "}
                    {t("globals.readMore")}
                  </a>
                </strong>
              </p>
            </div>
          </div>
          <div className="homescreen-header__contain-item3">
            <img src={getFile("img/images", `canasta-basica`, "jpg")} alt="" />
            <div className="homescreen-titles-b">
              <h2 className="homescreen__h5">{t("globals.takeLookGrocery")}</h2>
              <p className="homescreen__p5">
                {t("globals.takeLookGroceryText")}
                <strong className="homescreen__strong">
                  <a className="homescreen-a" href="">
                    {" "}
                    {t("globals.readMore")}
                  </a>
                </strong>
              </p>
            </div>
          </div>
        </div>
      </header>
      <div className="homescreen__container top">
        <h1 className="homescreen__h1">{t("globals.buyCategory")}</h1>
        <h2>{t("products.laptops")}</h2>
        <div className="homescreen__container-contain">
          {loading ? (
            <p>{t("globals.emptyProducts")}</p>
          ) : laptopProducts.length === 0 ? (
            <p>{t("globals.emptyProducts")}</p>
          ) : (
            laptopProducts.map((itemL) => (
              <CardProductsSmall
                key={itemL.id}
                productLink={`/products/${itemL.id}`}
                addToWish={"addwishlist-red"}
                img={itemL.images?.[0]?.img_url} // ✅ imagen principal
                images={itemL.images} // ✅ PASAR EL ARRAY
                sellingsText
                sellings={t("globals.sellings")}
                priceText
                price={itemL.price}
                onClick={() => handleSetProductClick(itemL)}
                prodHover={() => handleSetProductClick(itemL)}
                description={itemL.description}
                title={itemL.title}
                ratingss
                ratings={ratings}
                product_id={itemL.id}
              />
            ))
          )}
        </div>
      </div>
      <div className="homescreen__container">
        <h2>{t("globals.childrenSet")}</h2>
        <div className="homescreen__container-contain">
          {loading ? (
            <p>{t("globals.emptyProducts")}</p>
          ) : clothingProducts.length === 0 ? (
            <p>{t("globals.emptyProducts")}</p>
          ) : (
            clothingProducts.map((itemC) => (
              <CardProductsSmall
                key={itemC.id}
                productLink={`/products/${itemC.id}`}
                onClick={() => handleSetProductClick(itemC)}
                prodHover={() => handleSetProductClick(itemC)}
                addToWish={"addwishlist-red"}
                addTocart={"addcart-red"}
                img={itemC.images[0].img_url}
                sellingsText={true}
                sellings={t("globals.sellings")}
                priceText={true}
                price={itemC.price}
                productInfo={itemC}
                jpg="true"
                description={itemC.description}
                beforePrice={itemC.previousPrice}
                title={itemC.title}
                thumbnails={itemC.thumbnails}
                products="ropa para niños"
                ratingss={true}
                ratings={ratings}
                product_id={itemC.id}
              />
            ))
          )}
        </div>
      </div>
      <div className="homescreen__container">
        <h2>{t("globals.smartphones")}</h2>
        <div className="homescreen__container-contain">
          {loading ? (
            <p>{t("globals.emptyProducts")}</p>
          ) : cellphoneProducts.length === 0 ? (
            <p>{t("globals.emptyProducts")}</p>
          ) : (
            cellphoneProducts.map((itemCl) => (
              <CardProductsSmall
                key={itemCl.id}
                productLink={`/products/${itemCl.id}`}
                onClick={() => handleSetProductClick(itemCl)}
                prodHover={() => handleSetProductClick(itemCl)}
                addToWish={"addwishlist-red"}
                addTocart={"addcart-red"}
                img={itemCl.images?.[0]?.img_url}
                thumbnails={itemCl.images}
                sellingsText={true}
                sellings={t("globals.sellings")}
                priceText={true}
                price={itemCl.price}
                productInfo={itemCl}
                jpg="true"
                description={itemCl.description}
                beforePrice={itemCl.previousPrice}
                title={itemCl.name}
                category={"Celulares"}
                ratingss={true}
                ratings={ratings}
                product_id={itemCl.id}
              />
            ))
          )}
        </div>
      </div>

      <div className="homescreen__container">
        <Comments />
      </div>
    </section>
  );
};
