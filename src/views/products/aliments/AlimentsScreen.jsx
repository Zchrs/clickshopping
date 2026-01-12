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
import { Pagination } from "../../../components/globals/Pagination";

export const AlimentsScreen = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [showFeatures, setShowFeatures] = useState(true);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const ratings = useSelector((state) => state.product.ratings);
  const lang = useSelector((state) => state.langUI.lang);
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  // Productos
  const allProducts = useSelector((state) => state.product.productInfo);
  const newSpareParts = allProducts.filter(p => p.category === "repuestos nuevos");
  const usedSpareParts = allProducts.filter(p => p.category === "repuestos usados");
  const accesoriesParts = allProducts.filter(p => p.category === "partes y accesorios");

  // paginación
  const itemsPerPage = 24;
  const totalPages = Math.ceil(newSpareParts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNewSpareParts = newSpareParts.slice(startIndex, startIndex + itemsPerPage);
  const paginatedUsedSpareParts = usedSpareParts.slice(startIndex, startIndex + itemsPerPage);
  const paginatedAccesoriesParts = accesoriesParts.slice(startIndex, startIndex + itemsPerPage);
  
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
  dispatch(fetchProductsCategory("repuestos nuevos"));
  dispatch(fetchProductsCategory("repuestos usados"));
  dispatch(fetchProductsCategory("partes y accesorios"));
}, [dispatch]);

useEffect(() => {
  setCurrentPage(1);
}, [newSpareParts, usedSpareParts, accesoriesParts]);

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
            <h2 className="h2-light">Repuestos nuevos</h2>

            <div className="productscreen-cards">
              {loading ? (
                <p>{t("globals.emptyProducts")}</p>
              ) : newSpareParts.length === 0 ? (
                <div className="productscreen-empty">
                  <Empty message={t("globals.emptyProducts")} img="empty" />
                </div>
              ) : (
                paginatedNewSpareParts.map((itemL) => (
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
                        {totalPages.length > itemsPerPage && (
                        <div>
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            colorText="dark"
                            arrowPrev="button dark"
                            arrowNext="button dark"
                          />
                        </div>
                      )}
          </div>
        )}

        {/* 🔵 CONTENIDO 2 */}
        {activeTab === "used" && (
          <div className="productscreen-contain">
            <h2 className="h2-light">Repuestos usados</h2>

            <div className="productscreen-cards">
              {loading ? (
                <p>{t("globals.emptyProducts")}</p>
              ) : usedSpareParts.length === 0 ? (
                <div className="productscreen-empty">
                  <Empty message={t("globals.emptyProducts")} img="empty" />
                </div>
              ) : (
                paginatedUsedSpareParts.map((itemL) => (
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
                        {totalPages.length > itemsPerPage && (
                        <div>
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            colorText="dark"
                            arrowPrev="button dark"
                            arrowNext="button dark"
                          />
                        </div>
                      )}
          </div>
        )}
        
        {activeTab === "parts" && (
          <div className="productscreen-contain">
            <h2 className="h2-light">Partes y accesorios</h2>

            <div className="productscreen-cards">
              {loading ? (
                <p>{t("globals.emptyProducts")}</p>
              ) : accesoriesParts.length === 0 ? (
                <div className="productscreen-empty">
                  <Empty message={t("globals.emptyProducts")} img="empty" />
                </div>
              ) : (
                paginatedAccesoriesParts.map((itemL) => (
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
                        {totalPages.length > itemsPerPage && (
                        <div>
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            colorText="dark"
                            arrowPrev="button dark"
                            arrowNext="button dark"
                          />
                        </div>
                      )}
          </div>
        )}
      </div>
    </section>
  );
};
