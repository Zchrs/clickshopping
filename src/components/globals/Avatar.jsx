/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import { getFile } from "../../reducers/globalReducer";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startLogout } from "../../actions/authActions";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import styled from "styled-components";

export const Avatar = ({
  avtsmall,
  avtMedium,
  img,
  clas,
  dropData,
  classWhite,
  nameSmall,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lang = useSelector((state) => state.langUI.lang);
  const { t, i18n } = useTranslation();
  
  // Usar la estructura correcta del reducer
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  
  const [guestUser, setGuestUser] = useState(null);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang]);

  // Cargar guestUser solo si no hay usuario autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const guestData = localStorage.getItem("guestUser");
        if (guestData) {
          const parsed = JSON.parse(guestData);
          setGuestUser(parsed);
        } else {
          setGuestUser(null);
        }
      } catch (error) {
        console.error("Error al parsear guestUser:", error);
        setGuestUser(null);
      }
    } else {
      setGuestUser(null);
    }
  }, [isAuthenticated]);

  // Función para formatear el ID del invitado
  const formatGuestId = (id) => {
    if (!id) return "";
    if (id.length <= 10) return id;

    const firstPart = id.substring(0, 6);
    const lastPart = id.substring(id.length - 6);
    return `${firstPart}...${lastPart}`;
  };

  const handleLogout = () => {
    dispatch(startLogout());
    navigate("/auth/login");
  };

  // Determinar qué nombre mostrar
  const getDisplayName = () => {
    if (isAuthenticated && currentUser) {
      const nameParts = [];
      if (currentUser.name) nameParts.push(currentUser.name);
      if (currentUser.lastname) nameParts.push(currentUser.lastname);
      return nameParts.join(" ") || "Usuario";
    }
    
    if (guestUser) {
      return `${guestUser.name || "Invitado"} ${formatGuestId(guestUser.id)}`;
    }
    
    return "";
  };

  const displayName = getDisplayName();

  return (
    <AvaTar>
      <div className={clas}>
        {avtMedium && (
          <div className="avatar-default">
            <img src={getFile("png", `${img}`, "png")} alt="Avatar" />
          </div>
        )}
        {avtsmall && (
          <div className="tumb-default">
            <img src={getFile("png", `${img}`, "png")} alt="Avatar" />
          </div>
        )}
        
        <span className={classWhite}>
          <strong className={nameSmall}>{displayName}</strong>
        </span>

        {dropData && (
          <div className="avatar-usersession">
            {/* Usuario invitado */}
            {!isAuthenticated && guestUser && (
              <>
                <NavLink to="/cart-guest">
                  <i>
                    <img src={getFile("svg", "cart", "svg")} alt="Cart" />
                  </i>
                  {t("dashboard.cart")}
                </NavLink>
              </>
            )}

            {/* Usuario autenticado */}
            {isAuthenticated && currentUser && (
              <>
                <NavLink to="/dashboard">
                  <i>
                    <img src={getFile("svg", "panel-red", "svg")} alt="Dashboard" />
                  </i>
                  {t("dashboard.dashboard")}
                </NavLink>
                
                <NavLink to="/dashboard/orders">
                  <i>
                    <img src={getFile("svg", "order-red", "svg")} alt="Orders" />
                  </i>
                  {t("dashboard.orders")}
                </NavLink>
                
                <NavLink to="/dashboard/my-messages">
                  <i>
                    <img src={getFile("svg", "message", "svg")} alt="Messages" />
                  </i>
                  {t("dashboard.messages")}
                </NavLink>
                
                <NavLink to="/dashboard/currency">
                  <i>
                    <img src={getFile("svg", "currency", "svg")} alt="Currency" />
                  </i>
                  {t("dashboard.currency")}
                </NavLink>
                
                <NavLink to="/dashboard/payment-methods">
                  <i>
                    <img src={getFile("svg", "wallet", "svg")} alt="Payment" />
                  </i>
                  {t("dashboard.payment")}
                </NavLink>
                
                <NavLink to="/dashboard/wishlist">
                  <i>
                    <img src={getFile("svg", "wishlist", "svg")} alt="Wishlist" />
                  </i>
                  {t("dashboard.wishlist")}
                </NavLink>
                
                <NavLink to="/dashboard/coupons">
                  <i>
                    <img src={getFile("svg", "coupon", "svg")} alt="Coupons" />
                  </i>
                  {t("dashboard.coupons")}
                </NavLink>

                <div className="avatar-box">
                  <NavLink to="/seller/login">{t("dashboard.loginSeller")}</NavLink>
                  <NavLink to="/buyer-protection">{t("dashboard.buyerProtect")}</NavLink>
                  <NavLink to="/support">{t("dashboard.support")}</NavLink>
                  <NavLink to="/disputes">{t("dashboard.disputes")}</NavLink>
                  <NavLink to="/ipr">{t("dashboard.ipr")}</NavLink>
                </div>

                <button onClick={handleLogout}>
                  <i>
                    <img src={getFile("svg", "off", "svg")} alt="Logout" />
                  </i>
                  {t("dashboard.logout")}
                </button>
              </>
            )}

            {/* Si no hay usuario ni invitado, no mostrar nada */}
            {!isAuthenticated && !guestUser && null}
          </div>
        )}
      </div>
    </AvaTar>
  );
};

const AvaTar = styled.div`
  .avatar {
    position: relative;
    cursor: pointer;
    display: grid;
    gap: 10px;
    align-items: start;
    text-align: center;
    position: relative;
    height: fit-content;
    width: 100%;
    @media (max-width: 920px) {
      display: flex;
    }
    @media (max-width: 300px) {
      gap: 5px;
    }
    &-default {
      display: grid;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      @media (max-width: 920px) {
        width: 50px;
        height: 50px;
      }
    }
    .namesmall {
      font-size: 8px;
      font-weight: 700;
      padding: 0;
      position: absolute;
      width: 100%;
      left: 0px;
      bottom: 0;
    }
    .namepanel {
      display: flex;
      text-align: center;
      font-weight: 600;
      width: 150%;
      margin-left: -17px;
    }
    &.white {
      color: white;
    }
    .black {
      color: black;
    }

    &-usersession {
      display: grid;
      position: absolute;
      gap: 1px;
      z-index: 999;
      top: 32px;
      left: -145px;
      padding: 0px 0px;
      width: 280px;
      height: fit-content;
      transform: scaleY(0);
      background: white;
      border-radius: 10px;
      transition: all ease 0.3s;
      box-shadow:
        gray 1px 1px 4px,
        gray -1px -1px 4px;
      cursor: default;
      overflow: hidden;

      hr {
        margin: 5px 0;
      }

      @media (max-width: 301px) {
        left: -192px;
      }

      button {
        display: flex;
        text-decoration: none;
        font-size: 17px;
        border: none;
        font-weight: 400;
        cursor: pointer;
        gap: 5px;
        margin: 0;
        padding: 0;
        background: transparent;
        place-items: center;
        align-self: center;
        color: rgb(68, 66, 66);
        &:hover {
          color: var(--bg-primary);
          img {
            filter: var(--filter-primary);
          }
        }
        &:focus-visible {
          border: none;
          outline: none;
        }
        &:focus {
          border: none;
          outline: none;
        }
      }

      a,
      i {
        color: rgb(68, 66, 66);
        text-decoration: none;
        font-size: 17px;
        border: none;
        text-align: left;
        font-weight: 400;

        img {
          top: 0;
          left: 0;
          width: 18px;
          fill: var();
          filter: grayscale(200%);
        }

        &:hover {
          color: var(--bg-primary);
          img {
            filter: var(--filter-primary);
          }
        }
      }
    }
    &:hover .avatar-usersession {
      padding: 10px 15px;
      transform: scaleY(1);
      transition: all ease 0.3s;
      left: -145px;
    }

    &-box {
      border-top: rgba(128, 128, 128, 0.482) 1px solid;
      border-bottom: rgba(128, 128, 128, 0.482) 1px solid;
      padding: 15px 0;
      margin: 15px 0;
      display: grid;
      text-align: left;
      a {
        color: rgb(128, 125, 125);
        font-size: 16px;
      }
    }

    span {
      color: black;
      font-size: 18px;
    }

    img {
      width: 100%;
      @media (max-width: 920px) {
        width: 40px;
        height: 40px;
        margin: 0 auto;
      }
    }
  }

  .tumb {
    display: flex;
    gap: 7px;
    width: fit-content;
    position: relative;

    text-align: center;
    align-items: center;
    // border: yellow 1px solid;
    @media (max-width: 300px) {
      display: grid;
      gap: 1px;
      margin: 0;
    }

    &-default {
      margin: auto;
      display: grid;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      align-items: center;
      strong {
        margin-top: 20px;
      }
    }

    span {
      color: black;
      font-size: 15px;
      strong {
        font-weight: 500;
        font-size: 11px;
      }
      @media (max-width: 500px) {
        strong {
          font-weight: 500;
          font-size: 15px;
        }
      }
      @media (max-width: 300px) {
        text-align: left;
        line-height: normal;
        strong {
          font-weight: 500;
          font-size: 10px;
        }
      }
    }

    img {
      height: 100%;
      @media (max-width: 500px) {
        width: 100%;
      }
    }
  }
  .white {
    color: white;
    p,
    span {
      color: white;
    }
  }
`;