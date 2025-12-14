/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { useRoutesDash } from "./routes/routes";
import { startLogout } from "../../actions/authActions";
import { useTranslation } from 'react-i18next';

import '../../assets/sass/menu-dashb.scss'
export const MenuDashboard = () => {
  const routesDash = useRoutesDash();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(startLogout());
    navigate("/auth/login");
  };

  return (
    <div className="menudashb">
        <ul className="menudashb-links">
            {routesDash.map((item, index) => (
              <NavLink to={item.route} key={index}>
                <li>{item.text}</li>
              </NavLink>
            ))}
        </ul>
            <button onClick={handleLogout}>{t('auth.logout')}</button>
    </div>
  )
}
