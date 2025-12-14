/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { startLogoutAdmin } from "../../actions/authActions";
import { useRoutesDashAdmin } from "../../views/users/routes/routes";
import '../../assets/sass/manudashadmin.scss';

export const MenuDashboardAdmin = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(startLogoutAdmin());
    navigate("/");
  };


  return (
    <div className="menudashbadm">
        <ul className="menudashbadm-links">
            {useRoutesDashAdmin().map((item, index) => (
              <NavLink 
              className={({isActive}) => `${ isActive ? 'active' : '' }`} 
              to={item.route} key={index}
              >
                <li>{item.text}</li>
              </NavLink>
            ))}
        </ul>
            {/* <button onClick={handleLogout}>Cerrar sesión</button> */}
    </div>
  )
}



