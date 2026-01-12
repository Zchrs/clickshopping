/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { fetchProductsCategory, selectedProduct } from "../../../actions/productActions";
import { BreadCrumb } from "../../../components/globals/BreadCrumb"
import { startChecking } from "../../../actions/authActions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CardProducts } from "../../../components/globals/CardProducts";
import { Empty } from "../../../components/globals/Empty";
import { getFile } from "../../../../globalActions";
import { io } from "socket.io-client";
import { Pagination } from "../../../components/globals/Pagination";

export const TechnologyScreen = () => {
    const [activeTab, setActiveTab] = useState("laptops");
    const [showFeatures, setShowFeatures] = useState(true);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const ratings = useSelector((state) => state.product.ratings);
    const lang = useSelector((state) => state.langUI.lang);
    const [currentPage, setCurrentPage] = useState(1);

    // Productos
    const allProducts = useSelector((state) => state.product.productInfo);
  const laptops = allProducts.filter(p => p.category === "portatiles");
  const phones = allProducts.filter(p => p.category === "celulares");
  const speakers = allProducts.filter(p => p.category === "speakers");
  const others = allProducts.filter(p => p.category === "variado");

    // Configuración de paginación
    const { t, i18n } = useTranslation();
    const itemsPerPage = 12;
    const totalPages = Math.ceil(laptops.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedLaptops = laptops.slice(startIndex, startIndex + itemsPerPage);
    const paginatedPhones = phones.slice(startIndex, startIndex + itemsPerPage);
    const paginatedSpeakers = speakers.slice(startIndex, startIndex + itemsPerPage);
    const paginatedOthers = others.slice(startIndex, startIndex + itemsPerPage);

  
  
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
    dispatch(fetchProductsCategory("portatiles"))
    dispatch(fetchProductsCategory("celulares"))
    dispatch(fetchProductsCategory("speakers"))
    dispatch(fetchProductsCategory("variado"))
    }, [dispatch]);

      useEffect(() => {
    setCurrentPage(1);
  }, [laptops, phones, speakers, others]);
  
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
            className={activeTab === "laptops" ? "active" : ""}
            onClick={() => setActiveTab("laptops")}>
            Portátiles
          </button>
          <button
            className={activeTab === "phones" ? "active" : ""}
            onClick={() => setActiveTab("phones")}>
            Celulares
          </button>
          <button
            className={activeTab === "speakers" ? "active" : ""}
            onClick={() => setActiveTab("speakers")}>
            Parlantes portátiles
          </button>
          <button
            className={activeTab === "others" ? "active" : ""}
            onClick={() => setActiveTab("others")}>
            Variado
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
        {activeTab === "laptops" && (
          <div className="productscreen-contain">
            <h2 className="h2-light">Portátiles</h2>

            <div className="productscreen-cards">
              {loading ? (
                <p>{t("globals.emptyProducts")}</p>
              ) : laptops.length === 0 ? (
                <div className="productscreen-empty">
                  <Empty message={t("globals.emptyProducts")} />
                </div>
              ) : (
                paginatedLaptops.map((itemL) => (
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
            {/* {totalPages.length > itemsPerPage && ( */}
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
          {/* // )} */}
          </div>
        )}

        {/* 🔵 CONTENIDO 2 */}
        {activeTab === "phones" && (
          <div className="productscreen-contain">
            <h2 className="h2-light">Celulares</h2>

            <div className="productscreen-cards">
              {loading ? (
                <p>{t("globals.emptyProducts")}</p>
              ) : phones.length === 0 ? (
                <div className="productscreen-empty">
                  <Empty message={t("globals.emptyProducts")} img="empty" />
                </div>
              ) : (
                paginatedPhones.map((itemL) => (
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
        {activeTab === "speakers" && (
          <div className="productscreen-contain">
            <h2 className="h2-light">Parlantes portátiles</h2>

            <div className="productscreen-cards">
              {loading ? (
                <p>{t("globals.emptyProducts")}</p>
              ) : speakers.length === 0 ? (
                <div className="productscreen-empty">
                  <Empty message={t("globals.emptyProducts")} img="empty" />
                </div>
              ) : (
                paginatedSpeakers.map((itemL) => (
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
        {activeTab === "others" && (
          <div className="productscreen-contain">
            <h2 className="h2-light">Variados</h2>

            <div className="productscreen-cards">
              {loading ? (
                <p>{t("globals.emptyProducts")}</p>
              ) : others.length === 0 ? (
                <div className="productscreen-empty">
                  <Empty message={t("globals.emptyProducts")} img="empty" />
                </div>
              ) : (
                paginatedOthers.map((itemL) => (
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
  )
}
