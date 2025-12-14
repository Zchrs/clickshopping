/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { DashboardRouter } from "../router/AppRouter"
import { MenuDashboard } from "../views/users/MenuDashboard"
import { Avatar } from "../components/globals/Avatar"
import { HeaderDashboard } from "../components/globals/HeaderDashboard"
import { useMenu } from "./MenuContext"
import { useDispatch } from "react-redux";
import { ScreenResolution } from "../components/globals/ScreenResolution"
import { useEffect } from 'react';
import { startChecking } from "../actions/authActions";
import '../assets/sass/dashboard-layout.scss'

export const DashboardLayout = () => {
  
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(startChecking());
    }, [dispatch]);

  const { menu } = useMenu();

  return (
    <section className="dashboard"> 
      <header className="dashboard-header">
        <HeaderDashboard />
      </header>
      <section className="dashboard-container">
        <nav id="menu" className="dashboard-menu">
          <div className="dashboard-dashavt">
            <Avatar img={"default-avatar"} avtMedium={true} clas={"avatar"} nameSmall={"namepanel"} />
          </div>
          <MenuDashboard />
        </nav>
        {menu && ( <nav id="menu" className="dashboard-menumobile">
          <div className="dashboard-dashavt">
            <Avatar clas={"avatar"} nameSmall={"namepanel"} />
          </div>
          <MenuDashboard />
        </nav>)}
        <div className="dashboard-contain">
          <DashboardRouter />
        </div>
      </section>
      <footer className="dashboard-footer">
        <h2>Footer</h2>
        <ScreenResolution />
      </footer>
      <div id="modal-container">

</div>
    </section>
  )
}


