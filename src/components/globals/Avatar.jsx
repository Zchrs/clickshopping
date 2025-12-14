/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import { getFile } from "../../reducers/globalReducer"
import { NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { startChecking, startLogout } from "../../actions/authActions";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import '../../assets/sass/avatar.scss'

export const Avatar = ({avtsmall, avtMedium, img, clas, dropData, classWhite, nameSmall}) => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lang = useSelector(state => state.langUI.lang);
    const { t, i18n } = useTranslation();

    useEffect(() => {
      i18n.changeLanguage(lang);
      dispatch(startChecking());
    }, [i18n, lang, dispatch]);

    const handleLogout = () => {
      dispatch(startLogout());
      navigate("/auth/login");
    };
    
  return (
    <div className={clas}>
        {avtMedium && (<div className="avatar-default"><img src={getFile('png', `${img}`, 'png')} alt="" /></div>)}
        {avtsmall && (<div className="tumb-default"><img src={getFile('png', `${img}`, 'png')} alt="" /></div>)}
        <span className={classWhite}>
          {user ? <strong className={nameSmall}>{user.name} {user.lastname}</strong> : <strong className={nameSmall}>Default name</strong>}
        </span>
        {dropData && (<div className="avatar-usersession">

            <NavLink to={"/dashboard"}><i><img src={getFile('svg', 'panel-red', 'svg')} alt="" /></i>{ t("dashboard.dashboard") }</NavLink>
            <NavLink><i><img src={getFile('svg', 'order-red', 'svg')} alt="" /></i>{ t("dashboard.orders") }</NavLink>
            <NavLink><i><img src={getFile('svg', 'message', 'svg')} alt="" /></i>{ t("dashboard.messages") }</NavLink>
            <NavLink><i><img src={getFile('svg', 'currency', 'svg')} alt="" /></i>{ t("dashboard.currency") }</NavLink>
            <NavLink><i><img src={getFile('svg', 'wallet', 'svg')} alt="" /></i>{ t("dashboard.payment") }</NavLink>
            <NavLink><i><img src={getFile('svg', 'wishlist', 'svg')} alt="" /></i>{ t("dashboard.wishlist") }</NavLink>
            <NavLink><i><img src={getFile('svg', 'coupon', 'svg')} alt="" /></i>{ t("dashboard.coupons") }</NavLink>
            <div className="avatar-box">
              <NavLink>{ t("dashboard.loginSeller") }</NavLink>
              <NavLink>{ t("dashboard.buyerProtect") }</NavLink>
              <NavLink>{ t("dashboard.support") }</NavLink>
              <NavLink>{ t("dashboard.disputes") }</NavLink>
              <NavLink>{ t("dashboard.ipr") }</NavLink>
            </div>
            <button onClick={handleLogout}><i><img src={getFile('svg', 'off', 'svg')} alt="" /></i>{ t("dashboard.logout") }</button>
        </div>)}
    </div>
  )
}
