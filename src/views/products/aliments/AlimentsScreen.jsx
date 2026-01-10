/* eslint-disable no-unused-vars */

import axios from "axios";
import { fetchProductsCategory, selectedProduct, setProduct } from "../../../actions/productActions";
import { BreadCrumb } from "../../../components/globals/BreadCrumb";
import { CardProducts } from "../../../components/globals/CardProducts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startChecking } from "../../../actions/authActions";
import { useTranslation } from "react-i18next";
import io from "socket.io-client";
import { getFile } from "../../../../globalActions";
import { Empty } from "../../../components/globals/Empty";

export const AlimentsScreen = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [showFeatures, setShowFeatures] = useState(true);
  const dispatch = useDispatch();
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const ratings = useSelector((state) => state.product.ratings);
  const lang = useSelector((state) => state.langUI.lang);
  const { t, i18n } = useTranslation();


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
  dispatch(fetchProductsCategory("spare parts"))
    .then(setSpareParts);
  }, [dispatch]);

  const handleSetProductClick = (product) => {
    dispatch(selectedProduct(product));
  };

  return (
    <section className="productscreen">
      <div className="productscreen-header">
        <h2 className="productscreen-showroute">
          <BreadCrumb />
        </h2>
      </div>

      {/* 🔘 TABS */}
      <div className="productscreen-features" >
        <div className={`productscreen-features-menu ${showFeatures ? "show" : "hide"}`}>
          <button
            className={activeTab === "new" ? "active" : ""}
            onClick={() => setActiveTab("new")}>
            Repuestos nuevos
          </button>
          <button
            className={activeTab === "used" ? "active" : ""}
            onClick={() => setActiveTab("used")}>
            Repuestos de segunda
          </button>
          <button
            className={activeTab === "parts" ? "active" : ""}
            onClick={() => setActiveTab("parts")}>
            Partes y accesorios
          </button>
        <div 
        className={`productscreen-features-menu-btn ${showFeatures ? "showBtn" : "hideBtn"}`} 
        onClick={() => setShowFeatures(!showFeatures)}>
           <div className="productscreen-features-btn-arrow"></div>
        </div>
        </div>
      </div>

      <div className="productscreen-container">
        {/* 🟢 CONTENIDO 1 */}
        {activeTab === "new" && (
          <div className="productscreen-contain">
            <h2>Repuestos nuevos</h2>

            <div className="productscreen-cards">
              {loading ? (
                <p>{t("globals.emptyProducts")}</p>
              ) : spareParts.length === 0 ? (
                <div className="productscreen-empty">
                  <Empty message={t("globals.emptyProducts")} />
                </div>
              ) : (
                spareParts.map((itemL) => (
                  <CardProducts
                    key={itemL.id}
                    productLink={`/products/${itemL.id}`}
                    addToWish="addwishlist-red"
                    addTocart="addcart-red"
                    jpg
                    img={itemL.images?.[0]?.img_url} // ✅ imagen principal
                    images={itemL.images} // ✅ PASAR EL ARRAY
                    price={itemL.price}
                    onClick={() => handleSetProductClick(itemL)}
                    prodHover={() => handleSetProductClick(itemL)}
                    member="10% de descuento para miembros premium"
                    previuosPrice={itemL.previousPrice}
                    description={itemL.description}
                    title={itemL.title}
                    ratingss
                    ratings={ratings}
                    product_id={itemL.id}
                    classs="productcard background"
                    buyCr
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* 🔵 CONTENIDO 2 */}
        {activeTab === "used" && (
          <div className="productscreen-contain">
            <h2>Repuestos de segunda</h2>
            <div className="productscreen-cards">
              <CardProducts
                addToWish="addwishlist-red"
                addTocart="addcart-red"
                img={getFile("img/images", `manzana`, "jpg")}
                description="Manzana roja de la más alta calidad."
                title="Precio por 1kg"
                price="Cop $11.384"
                previuosPrice="Cop $11.984"
                discount="5%"
                member="10% de descuento para miembros premium"
                jpg
                classs="productcard background"
                buyCr
              />
              {/* resto de cards */}
            </div>
          </div>
        )}
        {activeTab === "parts" && (
          <div className="productscreen-contain">
            <h2>Partes y accesorios</h2>
            <div className="productscreen-cards">
              <CardProducts
                addToWish="addwishlist-red"
                addTocart="addcart-red"
                img={getFile("img/images", `maiz`, "jpg")}
                description="Tomates frescos hidropóndico nacional de la más alta calidad."
                title="Precio por 1kg"
                price="Cop $3.990"
                previuosPrice="Cop $4.200"
                discount="5%"
                member="10% de descuento para miembros premium"
                jpg
                classs="productcard background"
                buyCr
              />
              {/* resto de cards */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
