/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Comments, Pagination, CardProductsSmall, VideoModal } from "../../../index";
import { getFile } from "../../reducers/globalReducer";
import { useProductsSSE } from "../../hooks/useProductsSSE";
import { Link } from "react-router-dom";

import "../home/home.scss";
import { selectedProduct } from "../../actions/productActions";

export const HomeScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  
  useProductsSSE();

  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [adapters, setAdapters] = useState(null);
  const [otherProduct, setOtherProduct] = useState(null);

  const [laptopsImage, setLaptopsImage] = useState(null);
  const [adaptersImage, setAdaptersImage] = useState(null);
  const [othersImage, setOthersImage] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const allProducts = useSelector((state) => state.product.productInfo);
  const ratings = useSelector((state) => state.product.ratings);

  const rams = allProducts.filter((p) => p.category === "estuches");
  const additives = allProducts.filter((p) => p.category === "aditivos");

  const hardDisks = allProducts.filter((p) => p.category === "discos duros");
  const motherBoards = allProducts.filter((p) => p.category === "motherboards");

  const itemsPerPage = 16;
  const totalPages = Math.ceil(rams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedAditives = additives.slice(startIndex, startIndex + itemsPerPage);
  const paginatedRams = rams.slice(startIndex, startIndex + itemsPerPage);
  const paginatedHardDisks = hardDisks.slice(startIndex, startIndex + itemsPerPage);
  const paginatedMotherboards = motherBoards.slice(startIndex, startIndex + itemsPerPage);


  useEffect(() => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) return;

    const laptop = allProducts.find(
      (p) => p.category?.toLowerCase() === "audifonos"
    );

    const adapter = allProducts.find(
      (p) => p.category?.toLowerCase() === "adaptadores"
    );

    const other = allProducts.find(
      (p) => p.category?.toLowerCase() === "adaptadores"
    );

    if (laptop) {
      setFeaturedProduct(laptop);
      setLaptopsImage(laptop.images?.[0] || null);
    }

    if (adapter) {
      setAdapters(adapter);
      setAdaptersImage(adapter.images?.[0] || null);
    }

    if (other) {
      setOtherProduct(other);
      setOthersImage(other.images?.[0] || null);
    }
  }, [allProducts]);

  const handleSetProductClick = (product) => {
    dispatch(selectedProduct(product));
  };

  return (
    <section className="homescreen">
      <header className="homescreen-header">
        <div className="homescreen-header__contain">

          {/* PRODUCTO DESTACADO */}
          <div className="homescreen-header__contain-item">
            <img src={laptopsImage} alt="" />
            <div className="homescreen-titles">
              <h2 className="homescreen__h2">
                {t("globals.productOfMonth")}
              </h2>
              <p className="homescreen__p2">
                {t("globals.takeLookTechTextLap")}
                <strong className="homescreen__strong">{" "}
                  {!featuredProduct ? (
                    <span className="homescreen-loading">Comprar ahora</span>
                  ) : (
                    <Link
                      className="homescreen-a"
                      to={`/products/${featuredProduct.id}`}
                      onClick={() =>
                        dispatch(selectedProduct(featuredProduct))
                      }
                    >
                     {" "} <strong>{t("globals.buyNow")}</strong>
                    </Link>
                  )}
                </strong>
              </p>
            </div>
          </div>

          {/* ADAPTADORES */}
          <div className="homescreen-header__contain-item1">
            <img
              src={getFile("img", "estuches", "jpg")}
              alt=""
            />
            <div className="homescreen-titles-a">
              <h2 className="homescreen__h3">
                {t("globals.covers")}
              </h2>
              <p className="homescreen__p3">
                {t("globals.casesText")}
                  <Link className="homescreen-a" to="categories/covers">
                <strong className="homescreen__strong">
                   {" "} {t("globals.coversLink")}
                </strong>
                  </Link>
              </p>
            </div>
          </div>

          {/* VARIADOS */}
          <div className="homescreen-header__contain-item2">
            <img src={othersImage} alt="" />
            <div className="homescreen-titles-b">
              <h2 className="homescreen__h4">
                {t("globals.adapterTittle")}
              </h2>
              <p className="homescreen__p4">
                {t("globals.adapterText")}
                <strong className="homescreen__strong">
                  {!otherProduct ? (
                    <span className="homescreen-loading">Comprar ahora</span>
                  ) : (
                    <Link
                      className="homescreen-a"
                      to={`/products/${otherProduct.id}`}
                      onClick={() =>
                        dispatch(selectedProduct(otherProduct))
                      }
                    >
                     {" "} <strong>{t("globals.buyNow")}</strong>
                    </Link>
                  )}
                </strong>
              </p>
            </div>
          </div>

          {/* CANASTA */}
          <div className="homescreen-header__contain-item3">
            <img
              src={getFile("img", "maquillaje", "jpg")}
              alt=""
            />
            <div className="homescreen-titles-b">
              <h2 className="homescreen__h5">
                {t("globals.takeLookGrocery")}
              </h2>
              <p className="homescreen__p5">
                {t("globals.takeLookGroceryText")}
                  <Link className="homescreen-a" to="categories/make-up">
                <strong className="homescreen__strong">
                    {" "}{t("globals.make-up")}
                </strong>
                  </Link>
              </p>
            </div>
          </div>

        </div>
      </header>

      {/* aditivos */}
      <div className="homescreen__container">
        <h2>{t("globals.additivesTitle")}</h2>
        <div className="homescreen__container-contain">
          {paginatedAditives.map((item) => (
            <CardProductsSmall
              key={item.id}
              productLink={`/products/${item.id}`}
              img={item.images?.[0]}
              images={item.images}
              description={item.description}
              sellings={item.sellings}
              previousPrice={item.previousPrice}
              priceText
              title={item.name}
              tittleText
              ratings={ratings}
              addToCart
              ratingss
              product_id={item.id}
              onClick={() => handleSetProductClick(item)}
            />
          ))}
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
      {/* RAM */}
      <div className="homescreen__container">
        <h2>{t("globals.covers")}</h2>
        <div className="homescreen__container-contain">
          {paginatedRams.map((item) => (
            <CardProductsSmall
              key={item.id}
              productLink={`/products/${item.id}`}
              img={item.images?.[0]}
              images={item.images}
              description={item.description}
              title={item.name}
              tittleText
              sellings={item.sellings}
              previousPrice={item.previousPrice}
              priceText
              ratings={ratings}
              addToCart
              ratingss
              product_id={item.id}
              onClick={() => handleSetProductClick(item)}
            />
          ))}
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

      {/* DISCOS */}
      <div className="homescreen__container">
        <h2>{t("globals.adapters")}</h2>
        <div className="homescreen__container-contain">
          {paginatedHardDisks.map((item) => (
            <CardProductsSmall
              key={item.id}
              productLink={`/products/${item.id}`}
              img={item.images?.[0]}
              description={item.description}
              title={item.name}
              tittleText
              previousPrice={item.previousPrice}
              priceText
              ratings={ratings}
              ratingss
              product_id={item.id}
              onClick={() => handleSetProductClick(item)}
            />
          ))}
        </div>
      </div>

      {/* MOTHERBOARDS */}
      <div className="homescreen__container">
        <h2>{t("products.motherBoards")}</h2>
        <div className="homescreen__container-contain">
          {paginatedMotherboards.map((item) => (
            <CardProductsSmall
              key={item.id}
              productLink={`/products/${item.id}`}
              img={item.images?.[0]}
              description={item.description}
              title={item.name}
              tittleText
              previousPrice={item.previousPrice}
              priceText
              ratings={ratings}
              ratingss
              product_id={item.id}
              onClick={() => handleSetProductClick(item)}
            />
          ))}
        </div>
      </div>

      <div className="homescreen__container">
        <Comments />
      </div>
      
    </section>
  );
};