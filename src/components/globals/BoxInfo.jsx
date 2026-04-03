/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BaseButton } from "./BaseButton";
import { getFile } from "../../reducers/globalReducer";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../assets/sass/boxinfo.scss";
import { fetchCartUser } from "../../actions/cartActions";

// Constantes para localStorage
const CART_STORAGE_KEY = "cart";
const GUEST_USER_KEY = "guestUser";

export const BoxInfo = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [guestInfo, setGuestInfo] = useState(null);
  
  const lang = useSelector((state) => state.langUI.lang);
  // ✅ Usar la estructura correcta del reducer
  const { currentUser, isAuthenticated, isGuest } = useSelector((state) => state.auth);
  
  const { t, i18n } = useTranslation();
  
  const {
    title,
    titleA,
    text,
    textA,
    textB,
    textC,
    textD,
    icon,
    img,
    textT,
    textU,
    emptyCart,
    texts,
    btns,
    social,
    btnlogin,
    newUser,
    arrow,
  } = props;

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang]);

  // ✅ Cargar guestInfo desde localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const guestData = localStorage.getItem(GUEST_USER_KEY);
        if (guestData) {
          const parsed = JSON.parse(guestData);
          setGuestInfo(parsed);
        } else {
          const guestId = localStorage.getItem("guest_id");
          if (guestId) {
            setGuestInfo({ id: guestId, name: "Invitado", guest: true });
          } else {
            setGuestInfo(null);
          }
        }
      } catch (error) {
        console.error("Error loading guest info:", error);
        setGuestInfo(null);
      }
    } else {
      setGuestInfo(null);
    }
  }, [isAuthenticated]);

  // ✅ Cargar carrito (para usuario autenticado O invitado)
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      
      try {
        let items = [];
        
        // CASO 1: Usuario autenticado - cargar desde backend
      if (isAuthenticated && currentUser?.id) {
  const response = await fetchCartUser(currentUser.id);
  items = response.items || []; // 🔥 FIX
}
        // CASO 2: Usuario invitado - cargar desde localStorage
        else if (!isAuthenticated && guestInfo?.id) {
          const storedCart = localStorage.getItem(CART_STORAGE_KEY);
          if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            // Filtrar solo los items que pertenecen a este guest
            items = Array.isArray(parsedCart) 
              ? parsedCart.filter(item => item.guest_id === guestInfo.id)
              : [];
          }
        }
        
        setCartItems(items);
        calculateTotals(items);
      } catch (error) {
        console.error("Error loading cart items:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    // Solo cargar si hay usuario autenticado o guestInfo
    if (isAuthenticated || guestInfo) {
      loadCart();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [isAuthenticated, currentUser?.id, guestInfo]);

  const calculateTotals = (items) => {
    const subtotalValue = items.reduce(
      (sum, item) => sum + (Number(item.price) * Number(item.quantity)),
      0,
    );
    const totalItemsCount = items.reduce((sum, item) => sum + Number(item.quantity), 0);
    setSubtotal(subtotalValue);
    setTotal(totalItemsCount);
  };

  // ✅ Función para formatear precios
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // ✅ Función para obtener las primeras 3 imágenes del carrito
  const getCartImages = () => {
    return cartItems.slice(0, 3).map(item => ({
      id: item.id || item.product_id,
      url: item.img_urls?.[0] || (Array.isArray(item.img) ? item.img[0] : item.img) || "",
      name: item.name
    }));
  };

  const cartImages = getCartImages();
  const remainingCount = cartItems.length > 3 ? cartItems.length - 3 : 0;

  // ✅ Función para formatear ID de invitado
  const formatGuestId = (id) => {
    if (!id) return "";
    if (id.length <= 10) return id;
    const firstPart = id.substring(0, 6);
    const lastPart = id.substring(id.length - 6);
    return `${firstPart}...${lastPart}`;
  };

  return (
    <div className="loginbox">
      <div className="loginbox-subloginbox">
        <img
          className="loginbox-img"
          src={getFile("svg", `${icon}`, "svg")}
          alt="Icon"
        />
        {arrow && (
          <img
            className="loginbox__img"
            src={getFile("svg", "arrow-down-reed", "svg")}
            alt="Arrow"
          />
        )}
      </div>
      
      <div className="loginbox__box">
        {/* ✅ Sección de carrito - AHORA FUNCIONA PARA AMBOS TIPOS DE USUARIO */}
        {emptyCart && (
          <div>
            {isAuthenticated && currentUser ? (
              <h4 className="loginbox__cart-title">
                {t("cart.items", "Tienes")} ({total}) {t("cart.itemsCount", "artículos en tu carrito")}
              </h4>
            ) : guestInfo ? (
              <h4 className="loginbox__cart-title">
                {t("cart.guestItems", "Tienes")} ({total}) {t("cart.itemsCount", "artículos en tu carrito de invitado")}
                <small className="guest-badge"> {formatGuestId(guestInfo.id)}</small>
              </h4>
            ) : (
              <h4 className="loginbox__cart-title">
                {t("cart.guest", "Inicia sesión para ver tu carrito")}
              </h4>
            )}
            
            {loading ? (
              <p className="loginbox__loading">{t("common.loading", "Cargando...")}</p>
            ) : !isAuthenticated && !guestInfo ? (
              <div className="loginbox-empty">
                <img src={getFile("svg", "login", "svg")} alt="Login Required" />
                <h2 className="loginbox__h2">{t("cart.loginRequired", "Inicia sesión para ver tu carrito")}</h2>
              </div>
            ) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
              <div className="loginbox-empty">
                <img src={getFile("svg", `${img}`, "svg")} alt="Empty Cart" />
                <h2 className="loginbox__h2">
                  {isAuthenticated 
                    ? (title || t("cart.empty", "Tu carrito está vacío"))
                    : t("cart.guestEmpty", "Tu carrito de invitado está vacío")}
                </h2>
              </div>
            ) : (
              <>
                <div className="loginbox-flex">
                  {cartImages.map((item) => (
                    <img 
                      className="loginbox-imgproducts" 
                      key={item.id} 
                      src={item.url} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = getFile("svg", "default-product", "svg");
                      }}
                    />
                  ))}
                  {remainingCount > 0 && (
                    <div className="loginbox-more">
                      <span>+{remainingCount}</span>
                    </div>
                  )}
                </div>
                
                {cartItems.length > 0 && (
                  <div className="loginbox-cart-summary">
                    <div className="loginbox-cart-total">
                      <span>{t("cart.subtotal", "Subtotal")}:</span>
                      <strong>${formatPrice(subtotal)}</strong>
                    </div>
                    <NavLink 
                      to={isAuthenticated ? "/dashboard/my-cart" : "/cart-guest"} 
                      className="loginbox-a"
                    >
                      {t("cart.viewCart", "Ver carrito completo")}
                    </NavLink>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ✅ Sección de textos y enlaces */}
        {texts && (
          <div className="loginbox__container">
            <h2 className="loginbox__h4">{titleA}</h2>
            {textB && (
              <div className="loginbox-texts">
                <NavLink to={isAuthenticated ? "/dashboard" : "/auth/login"} className="loginbox-a">
                  {isAuthenticated ? t("dashboard.title", "Dashboard") : text}
                </NavLink>
                &nbsp;
                <p className="loginbox__p">{textA}</p>
                &nbsp;
                {!isAuthenticated && (
                  <NavLink to={"/auth/register"} className="loginbox-a">
                    {textB}
                  </NavLink>
                )}
              </div>
            )}
            {textC && (
              <div className="loginbox-textsa">
                <p className="loginbox__p">{textC}</p>
              </div>
            )}
            
            {/* ✅ Botón de login condicional */}
            {btnlogin && !isAuthenticated && (
              <BaseButton
                label={t("auth.login")}
                classs={"button primary"}
                $colorbtn={"var(--primary)"}
                $colortextbtnprimary={"var(--light)"}
                $colorbtnhoverprimary={"var(--bg-primary-tr)"}
                $colortextbtnhoverprimary={"var(--light)"}
                link={"/auth/login"}
              />
            )}
            
            {btnlogin && isAuthenticated && (
              <BaseButton
                label={t("dashboard.title", "Ir al Dashboard")}
                classs={"button primary"}
                $colorbtn={"var(--primary)"}
                $colortextbtnprimary={"var(--light)"}
                $colorbtnhoverprimary={"var(--bg-primary-tr)"}
                $colortextbtnhoverprimary={"var(--light)"}
                link={"/dashboard"}
              />
            )}
            
            {newUser && !isAuthenticated && <p className="loginbox__p2">{textD}</p>}
            {newUser && isAuthenticated && (
              <p className="loginbox__p2">
                {t("auth.welcome", "Bienvenido")} {currentUser?.name}
              </p>
            )}
          </div>
        )}

        {/* ✅ Texto adicional */}
        {textT && <p className="loginbox__p">{textU}</p>}

        {/* ✅ Botones de login/registro */}
        {btns && !isAuthenticated && (
          <div className="loginbox__buttons">
            <h3 className="loginbox__h3">{title}</h3>
            <p className="loginbox__p">{text}</p>
            <div className="loginbox__btns">
              <BaseButton
                label={t("auth.login")}
                classs={"button primary"}
                $colorbtn={"var(--primary)"}
                $colortextbtnprimary={"var(--light)"}
                $colorbtnhoverprimary={"var(--primary-semi)"}
                $colortextbtnhoverprimary={"var(--light)"}
                link={"/auth/login"}
              />
              <BaseButton
                label={t("auth.register")}
                classs="button secondary"
                $colorbtn={"var(--secondary)"}
                $colorbtntextsecondary={"var(--tertiary)"}
                $colorbtnhoversecondary={"var(--secondary-semi)"}
                $hovercolorbtntextsecondary={"var(--light)"}
                link={"/auth/register"}
              />
            </div>
          </div>
        )}

        {btns && isAuthenticated && (
          <div className="loginbox__buttons">
            <h3 className="loginbox__h3">{t("dashboard.welcome", "Bienvenido de vuelta")}</h3>
            <p className="loginbox__p">
              {t("dashboard.loggedAs", "Has iniciado sesión como")} {currentUser?.email}
            </p>
            <div className="loginbox__btns">
              <BaseButton
                label={t("dashboard.title", "Ir al Dashboard")}
                classs={"button primary"}
                $colorbtn={"var(--primary)"}
                $colortextbtnprimary={"var(--light)"}
                $colorbtnhoverprimary={"var(--primary-semi)"}
                $colortextbtnhoverprimary={"var(--light)"}
                link={"/dashboard"}
              />
            </div>
          </div>
        )}

        {/* ✅ Redes sociales */}
        {social && (
          <div className="loginbox__social">
            <div className="loginbox__gruops">
              <h4>{t("auth.sesion", "O inicia sesión con")}</h4>
              <hr />
            </div>
            <div className="loginbox__social-box">
              <img src={getFile("svg", "facebook", "svg")} alt="Facebook" />
              <img src={getFile("svg", "twitter", "svg")} alt="Twitter" />
              <img src={getFile("svg", "linkedin", "svg")} alt="LinkedIn" />
              <img src={getFile("svg", "instagram", "svg")} alt="Instagram" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};