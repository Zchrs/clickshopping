/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { getFile } from "../../reducers/globalReducer";
import { useStickyHeader } from "../../hooks/useStickyHeader";

import { BoxInfo } from "./BoxInfo";
import { InputSearch } from "./InputSearch";
import { BaseButton } from "./BaseButton";
import { Lang } from "./Lang";
import { Avatar } from "./Avatar";

export const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuFixed = useStickyHeader(100);



  const buttonsList = [
    { route: "home", text: t("globals.home") },
    { route: "categories/books", text: t("globals.foods") },
    { route: "categories/technology", text: t("globals.technology") },
    { route: "categories/fashion", text: t("globals.clothing") },
  ];

  return (
    <HeaDer>
      <div className="head">
        <div className={menuFixed ? "head-top" : "head-hidden"}>
          <div className="head-logo">
            <img src={getFile("svg", "logo", "svg")} alt="Logo" />
          </div>
          <div className="head-social">
            <h5>Síguenos: </h5>
              <Link to="https://www.instagram.com/clikshoping.oficial?utm_source=qr&igsh=MXB6aGx2Z3FnMjFvdA==" target="_blank">
              <img src={getFile("svg", `instagram`, "svg")} alt="" />
              </Link>
              <Link to="https://web.facebook.com/people/Clickshopping/100068470897448/" target="_blank">
              <img src={getFile("svg", `facebook`, "svg")} alt="" />
              </Link>
              <Link to="https://vm.tiktok.com/ZS9JoNDJUmHLQ-rczYW/" target="_blank">
              <img src={getFile("svg", `tiktok`, "svg")} alt="" />
              </Link>
          </div>
          <div className="head-btns">
            {!user ? (
              <div className="head-btns-div">
                <BaseButton
                  label={t("auth.login")}
                  link={"auth/login"}
                  classs={"button small"}
                  $colorbtnsmall={"var(--secondary)"}
                  $colorbtntextsmall={"var(--light)"} 
                  $colorbtnhoversmall={"var(--bg-secondary-semi)"}
                  $colortextbtnhoversmall={"white"}
                />
                <BaseButton
                  label={t("auth.register")}
                  link={"auth/register"}
                  classs={"button small"}
                  $colorbtnsmall={"var(--primary)"}
                  $colorbtntextsmall={"var(--light)"}
                  $colorbtnhoversmall={"var(--primary-semi)"}
                  $colortextbtnhoversmall={"var(--light)"}
                  width={"fit-content"}
                />
                <div>
                  <Lang />
                </div>
              </div>
            ) : (
              <div className="head-btns-div-avatar">
                <Avatar
                  dropData={true}
                  img={"default-avatar"}
                  avtsmall={true}
                  clas={"avatar tumb"}
                />
              </div>
            )}
          </div>
          <div className="head-top__menu">
            <ul>
              {!user ? (
                <BoxInfo
                  arrow={true}
                  icon="user-red"
                  btns={true}
                  title={t("auth.welcome")}
                  social={true}
                />
              ) : (
                false
              )}
              {!user ? (
                <BoxInfo
                  arrow={true}
                  icon="cart-red"
                  title={t("cart.empty")}
                  text={t("auth.login")}
                  textA="o"
                  textB={t("auth.register")}
                  emptyCart={true}
                  img="empty-cart"
                  texts={true}
                />
              ) : (
                <BoxInfo
                  arrow={true}
                  icon="cart-red"
                  title={t("cart.empty")}
                  newUser={true}
                  textU={t("cart.dare")}
                  emptyCart={true}
                  textT={true}
                  img="empty-cart"
                />
              )}
              {!user ? (
                <BoxInfo
                  arrow={true}
                  icon="letter"
                  texts={true}
                  titleA={t("comunications.noMessage")}
                  textC={t("globals.messages")}
                  btnlogin={true}
                  newUser={true}
                  textD={t("globals.newCustomer")}
                  img="no-message"
                />
              ) : (
                <BoxInfo
                  arrow={true}
                  icon="letter"
                  texts={true}
                  titleA={t("comunications.noMessage")}
                  newUser={true}
                  img="no-message"
                />
              )}
              <Lang />
              <ul>
                {!user ? (
                  <NavLink className="head-top-a" to="/auth/register">
                    <li>{t("auth.newAccount")}</li>
                  </NavLink>
                ) : (
                  false
                )}
                <NavLink>
                  <li>{t("globals.help")}</li>
                </NavLink>
              </ul>
              {user ? (
                <Avatar
                  dropData={true}
                  img={"default-avatar"}
                  avtsmall={true}
                  clas={"avatar tumb"}
                />
              ) : (
                false
              )}
            </ul>
          </div>
        </div>
        <div className="head-menu">
          <div className="head-menu-woman">
            <BaseButton
            img={true}
            icon={"female"}
              textLabel
              classs={"button primary"}
              $colorbtn={"var(--danger)"}
              $colortextbtnprimary={"var(--light)"}
              $colorbtnhoverprimary={"var(--woman)"}
              $colortextbtnhoverprimary={"white"}
              label="Exclusivo femenino"
              handleClick={() => navigate("/categories/female")}
            />
          </div>
          <div className="head-menu__container">
            <div>
              <InputSearch clas="inputSearch large" />
            </div>
            <ul className="ul">
              {buttonsList.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.route}
                  className={({ isActive }) => (isActive ? "isactive" : "li")}>
                  <li>{item.text}</li>
                </NavLink>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </HeaDer>
  );
};


const HeaDer = styled.div`
  .head {
    display: grid;
    width: 100%;
    align-items: center;

    &-btns {
      display: none;
      @media (max-width: 920px) {
        transition: all ease 0.5s;
        display: grid;
        width: fit-content;
        height: fit-content;
        gap: 3px;
        position: absolute;
        right: 0px;

        &-div {
          display: flex;
          gap: 8px;
          margin: 0;
          padding: 0;
          align-items: center;
          height: 100%;
          &-avatar {
            position: absolute;
            right: 15px;
          }
        }
      }
      @media (max-width: 420px) {
        transition: all ease 0.5s;
        align-items: center;
        display: flex;
        gap: 2px;
      }
      @media (max-width: 380px) {
        transition: all ease 0.5s;
        align-items: center;
        display: flex;
        width: 230px;
        gap: 5px;
        position: absolute;
        left: 185px;
      }
      @media (max-width: 320px) {
        transition: all ease 0.5s;
        align-items: center;
        display: flex;
        width: 180px;
        gap: 5px;
        position: absolute;
        left: 115px;
        // border: #00a9ff 1px solid;
      }
    }
    &-top {
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      width: 100%;
      z-index: 999;
      position: fixed;
      box-shadow: var(--primary) 1px 1px 3px;
      transition: all ease 0.5s;
      top: 0;

      &-a {
        color: black;
        transition: all ease 0.3s;

        &:hover {
          color: #00a9ff;
        }
      }

      @media (max-width: 600px) {
        position: fixed;
        top: 0;
        z-index: 999;
        width: 100%;
        display: grid;
        height: 70px;
        border-bottom: rgba(0, 0, 0, 0.559) 1px solid;
      }

      &__menu {
        height: 100%;
        position: relative;
        display: grid;
        align-items: center;
        width: fit-content;
        background: transparent;
        // border: #00a9ff 1px solid;
        z-index: 9999;

        @media (max-width: 920px) {
          position: fixed;
          display: none;
          justify-content: center;
          z-index: 10000;
          top: 70px;
          left: 0;
          background: white;
          width: 100%;
          height: 50px;
        }

        ul {
          display: grid;
          align-items: center;
          margin: auto;
          position: relative;
          height: fit-content;
          list-style: none;
          display: flex;
          gap: 20px;

          li {
            height: 100%;
            align-items: center;
            display: grid;
            gap: 5px;
            // font-size: 1.5rem;
            cursor: pointer;
            color: black;
            font-weight: 500;
            transition: all ease 0.3s;

            img {
              display: block;
              height: 6px;
              transition: all ease 0.3s;
              filter: grayscale(100%);
            }

            &:hover {
              color: var(--primary);
              transition: all ease 0.3s;

              img {
                transform: rotateZ(180deg);
                transition: all ease 0.3s;
                filter: grayscale(0%);
              }
            }
          }
        }
      }
    }
    &-hidden {
      padding: 10px;
      display: flex;
      justify-content: space-between;
      transition: all ease 0.5s;
      align-items: center;
      background: white;
      width: 100%;
      z-index: 999;
      position: relative;
      border-bottom: none;

      &-a {
        color: black;
        transition: all ease 0.3s;

        &:hover {
          color: #00a9ff;
        }
      }

      @media (max-width: 920px) {
        position: fixed;
        top: 0;
        z-index: 999;
        width: 100%;
        display: grid;
        height: 70px;
        border-bottom: rgba(0, 0, 0, 0.559) 1px solid;
      }

      &__menu {
        height: 100%;
        position: relative;
        display: grid;
        align-items: center;
        width: fit-content;
        background: transparent;
        // border: #00a9ff 1px solid;
        z-index: 9999;

        @media (max-width: 920px) {
          position: fixed;
          display: none;
          justify-content: center;
          z-index: 10000;
          top: 70px;
          left: 0;
          background: white;
          width: 100%;
          height: 50px;
        }

        ul {
          display: grid;
          align-items: center;
          margin: auto;
          position: relative;
          height: fit-content;
          list-style: none;
          display: flex;
          gap: 20px;

          li {
            height: 100%;
            align-items: center;
            display: grid;
            gap: 5px;
            // font-size: 1.5rem;
            cursor: pointer;
            color: black;
            font-weight: 500;
            transition: all ease 0.3s;

            img {
              display: block;
              height: 6px;
              transition: all ease 0.3s;
              filter: grayscale(100%);
            }

            &:hover {
              color: #00a9ff;
              transition: all ease 0.3s;

              img {
                transform: rotateZ(180deg);
                transition: all ease 0.3s;
                filter: grayscale(0%);
              }
            }
          }
        }
      }
    }
    &-logo {
      cursor: pointer;

      img {
        height: 40px;

        @media (max-width: 600px) {
          height: 35px;
        }

        @media (max-width: 399px) {
          height: 20px;
        }
      }
    }
    &-social{
      display: flex;
      align-items: center;
      gap: 10px;
      img{
        width: 30px;
      }
      @media (max-width: 920px) {
        display: none;
      }
    }

    &-menu {
      display: grid;
      width: 100%;
      margin: 0 auto;
      color: white;
      background: black;
      height: 250px;
      place-items: center;
      padding: 0;

      &-woman {
        display: grid;
        position: absolute;
        top: 90px;
        left: 15px;
        width: 16%;
        height: fit-content;
        @media (max-width: 580px) {
          width: 50%;
        }
      }

      @media (max-width: 700px) {
        margin-top: 70px;
      }
      // font-size: 1.6rem;
      a {
        color: white;
        width: 100%;
        height: 100%;
        &:hover {
          color: #f9f2f2;
        }
      }

      .ul {
        margin-top: 0px;
        padding: 0;
        display: flex;
        list-style: none;
        gap: 20px;
        margin: 0 auto;
        justify-content: center;

        @media (max-width: 700px) {
          width: 80%;
          gap: 5px;
        }

        .li {
          display: grid;
          padding: 8px 38px;
          height: 40px;
          border-radius: 10px 10px 0px 0px;
          cursor: pointer;
          place-items: center;
          background: var(--primary);

          &:hover {
            background: var(--primary-semi);
          }

          @media (max-width: 700px) {
            padding: 6px 8px;
            // font-size: 1.4rem;
          }

          @media (max-width: 399px) {
            padding: 4px 8px;
            // font-size: 1.1rem;
            height: 35px;
          }
        }
      }

      &__container {
        display: grid;
        width: 100%;
        gap: 10px;
        margin-top: 55px;
        &-lang {
          position: absolute;
          color: #f9f2f2;
          top: 90px;
          @media (min-width: 920px) {
            display: none;
          }
        }
      }
    }
  }

  .isactive {
    transition: all 0.3s ease-in-out;
    place-items: center;
    background: var(--light);
    display: grid;
    padding: 8px 38px;
    height: 40px;
    border-radius: 10px 10px 0px 0px;
    color: var(--dark);
    li{
      color: var(--dark);
      font-weight: 600;
    }

    @media (max-width: 700px) {
      padding: 6px 8px;
      // font-size: 1.4rem;
    }

    @media (max-width: 399px) {
      padding: 4px 8px;
      height: 35px;
      // font-size: 1.1rem;
    }
  }
`;
