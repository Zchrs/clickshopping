/* eslint-disable no-unused-vars */

import { fetchProducts, selectedProduct, setProduct } from "../../../actions/productActions";
import { BreadCrumb, CardProducts, Empty, Pagination } from "../../../../index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export const AlimentsScreen = () => {
  const [showFeatures, setShowFeatures] = useState(true);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const ratings = useSelector((state) => state.product.ratings);
  const lang = useSelector((state) => state.langUI.lang);
  const allProducts = useSelector((state) => state.product.productInfo || []);
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("booksRecent");
  const itemsPerPage = 24;
  
  /* ✅ FILTROS */
  const booksRecent = allProducts.filter(p => p.category === "recientes");
  const genre = allProducts.filter(p => p.category === "genero");
  const news = allProducts.filter(p => p.category === "nuevos");
  const used = allProducts.filter(p => p.category === "usados");
  const all = allProducts.filter(p => p.category === "accesorios");

  const productsByTab = {
    booksRecent,
    genre,
    all,
  };
  
  const activeProducts = productsByTab[activeTab] || [];
  
  // Productos
  /* ✅ PAGINACIÓN DINÁMICA */
  const totalPages = Math.ceil(activeProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = activeProducts.slice(startIndex, startIndex + itemsPerPage);


    /* ✅ RESET DE PAGINACIÓN AL CAMBIAR TAB */
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);
  
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang, dispatch]);

useEffect(() => {
  dispatch(fetchProducts());
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
      <div className="productscreen-features">
        <div className={`productscreen-features-menu ${showFeatures ? "show" : "hide"}`}>
          <button className={activeTab === "booksRecent" ? "active" : ""} onClick={() => setActiveTab("booksRecent")}>
            Agregados recientemente
          </button>
          <button className={activeTab === "genre" ? "active" : ""} onClick={() => setActiveTab("genre")}>
            Género
          </button>
          <button className={activeTab === "news" ? "active" : ""} onClick={() => setActiveTab("news")}>
            Nuevos
          </button>
          <button className={activeTab === "news" ? "active" : ""} onClick={() => setActiveTab("used")}>
            Usados
          </button>
          <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
            Todos
          </button>
          <div
            className={`productscreen-features-menu-btn ${showFeatures ? "showBtn" : "hideBtn"}`}
            onClick={() => setShowFeatures(!showFeatures)}
          >
            <div className="productscreen-features-btn-arrow"></div>
          </div>
        </div>
      </div>

      {/* 🟢 CONTENIDO */}
      <div className="productscreen-container">
        <div className="productscreen-contain">
          <h2 className="h2-light">
            {activeTab === "booksRecent" && "Agregados recientemente"}
            {activeTab === "genre" && "Género"}
            {activeTab === "news" && "Nuevos"}
            {activeTab === "used" && "Usados"}
          </h2>

          <div className="productscreen-cards">
            {activeProducts.length === 0 ? (
              <div className="productscreen-empty">
                <Empty img="empty" message={t("globals.emptyProducts")} />
              </div>
            ) : (
              paginatedProducts.map((itemL) => (
                <CardProducts
                  key={itemL.id}
                  productLink={`/products/${itemL.id}`}
                  jpg
                  img={itemL.images?.[0]?.img_url}
                  images={itemL.images}
                  price={itemL.previousPrice}
                  previousPrice={itemL.price}
                  onClick={() => handleSetProductClick(itemL)}
                  prodHover={() => handleSetProductClick(itemL)}
                  member="10% de descuento para miembros premium"
                  previuosPrice={itemL.previousPrice}
                  quantity={itemL.quantity}
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

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              colorText="dark"
              arrowPrev="button dark"
              arrowNext="button dark"
            />
          )}
        </div>
      </div>
    </section>
  );
};
