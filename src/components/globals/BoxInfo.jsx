/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BaseButton } from "./BaseButton";
import { getFile } from "../../reducers/globalReducer";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../assets/sass/boxinfo.scss";

export const BoxInfo = (props) => {
  // const user = useSelector((state) => state.auth.user);
  const lang = useSelector((state) => state.langUI.lang);
  const { t, i18n } = useTranslation();
  const {
    title,
    titleA,
    // subtible,
    text,
    textA,
    textB,
    textC,
    textD,
    icon,
    img,
    textT,
    textU,
    // linkB,
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
        {emptyCart && (
          <div className="loginbox-empty">
            <img src={getFile("svg", `${img}`, "svg")} alt="Empty Cart" />
            <h2 className="loginbox__h2">{title}</h2>
          </div>
        )}
        {texts && (
          <div className="loginbox__container">
            <h2 className="loginbox__h4">{titleA}</h2>
            {textB && (
              <div className="loginbox-texts">
                <NavLink to={"auth/login"} className="loginbox__a">
                  {text}
                </NavLink>
                &nbsp;
                <p className="loginbox__p">{textA}</p>
                &nbsp;
                <NavLink to={"auth/register"} className="loginbox__a">
                  {textB}
                </NavLink>
              </div>
            )}
            {textC && (
              <div className="loginbox-textsa">
                <p className="loginbox__p">{textC}</p>
              </div>
            )}
            {btnlogin && (
              <BaseButton
                label={t("auth.login")}
                classs={'button primary'} 
                colorbtn={"var(--primary)"}
                colortextbtnprimary={"var(--light)"}
                colorbtnhoverprimary={"var(--bg-primary-tr)"}
                colortextbtnhoverprimary={"var(--light)"}
                link={"auth/login"}
              />
            )}
            {newUser && <p className="loginbox__p2">{textD}</p>}
          </div>
        )}
        {textT && <p className="loginbox__p">{textU}</p>}
        {btns && (
          <div className="loginbox__buttons">
            <h3 className="loginbox__h3">{title}</h3>
            <p className="loginbox__p">{text}</p>
            <div className="loginbox__btns">
              <BaseButton
                label={t("auth.login")}
                classs={'button primary'} 
                colorbtn={"var(--primary)"}
                colortextbtnprimary={"var(--light)"}
                colorbtnhoverprimary={"var(--primary-light)"}
                colortextbtnhoverprimary={"var(--light)"}
                link={"auth/login"}
              />
              <BaseButton
                label={t("auth.register")}
                classs="button secondary"
                colorbtn={"var(--secondary)"}
                colorbtntextsecondary={"var(--tertiary)"}
                colorbtnhoversecondary={"var(--secondary-semi)"}
                hovercolorbtntextsecondary={"var(--light)"}
                link={"auth/register"}
              />
            </div>
          </div>
        )}
        {social && (
          <div className="loginbox__social">
            <div className="loginbox__gruops">
              <h4>{t("auth.sesion")}</h4>
              <hr />
            </div>
            <div className="loginbox__social-box">
              <img src={getFile("svg", `facebook`, "svg")} alt="Facebook" />
              <img src={getFile("svg", `twitter`, "svg")} alt="Twitter" />
              <img src={getFile("svg", `linkedin`, "svg")} alt="LinkedIn" />
              <img src={getFile("svg", `instagram`, "svg")} alt="Instagram" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
