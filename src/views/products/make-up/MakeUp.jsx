/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { fetchProducts, selectedProduct } from "../../../actions/productActions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CardProducts, Empty, BreadCrumb, Pagination } from "../../../../index";

export const MakeUp = () => {
  const [activeTab, setActiveTab] = useState("pencilLips");
  const [showFeatures, setShowFeatures] = useState(true);
  const dispatch = useDispatch();
  const ratings = useSelector((state) => state.product.ratings);
  const lang = useSelector((state) => state.langUI.lang);
  const allProducts = useSelector((state) => state.product.productInfo || []);
  const [currentPage, setCurrentPage] = useState(1);

  const { t, i18n } = useTranslation();
  const itemsPerPage = 24;

  /* ✅ FILTROS */
  const pencilLips = allProducts.filter(p => p.category === "labiales");
  const watercolors = allProducts.filter(p => p.category === "Acuarelas");
  const bases = allProducts.filter(p => p.category === "bases");
  const all = allProducts.filter(p => p.category === "todo");

  const productsByTab = {
    pencilLips,
    watercolors,
    bases,
    all,
  };

  const activeProducts = productsByTab[activeTab] || [];

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
    dispatch(fetchProducts()); // 👈 IMPORTANTE
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
          <button className={activeTab === "pencilLips" ? "active" : ""} onClick={() => setActiveTab("pencilLips")}>
            Labiales
          </button>
          <button className={activeTab === "watercolors" ? "active" : ""} onClick={() => setActiveTab("watercolors")}>
            Acuarelas
          </button>
          <button className={activeTab === "bases" ? "active" : ""} onClick={() => setActiveTab("bases")}>
            Bases
          </button>
          <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
            Todo
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
            {activeTab === "pencilLips" && "Labiales"}
            {activeTab === "watercolors" && "Acuarelas"}
            {activeTab === "bases" && "Bases"}
            {activeTab === "all" && "Todo"}
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
                  previousPrice={itemL.price}
                  price={itemL.previousPrice}
                  onClick={() => handleSetProductClick(itemL)}
                  prodHover={() => handleSetProductClick(itemL)}
                  member="10% de descuento para miembros premium"
                  previuosPrice={itemL.previousPrice}
                  description={itemL.description}
                  quantity={itemL.quantity}
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

