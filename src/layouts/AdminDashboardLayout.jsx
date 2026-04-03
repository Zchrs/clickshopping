import { DashboardAdminRouter } from "../router/AppRouter"
import { useDispatch } from "react-redux";
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { startCheckingAdmin } from "../actions/authActions";
import { HeaderAdmin, MenuDashboardAdmin, FooterAdmin } from '../../index'

export const AdminDashboardLayout = () => {

  const dispatch = useDispatch();

  // 🔥 estado menú
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  useEffect(() => {
    dispatch(startCheckingAdmin());
  }, [dispatch]);

  return (
    <AdmDashLayout className="dashboardlayout">

      <div className="dashboardlayout-header">
        <HeaderAdmin />
        {/* 🔥 botón menú */}
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {/* 🔥 overlay */}
      {isMenuOpen && (
        <div className="overlay" onClick={() => setIsMenuOpen(false)} />
      )}

      <div className="dashboardlayout-contain">

        {/* 🔥 menú con clase dinámica */}
        <nav className={`dashboardlayout-menud ${isMenuOpen ? "open" : ""}`}>
          <MenuDashboardAdmin />
        </nav>

        <div className="dashboardlayout-container">
          <DashboardAdminRouter />
        </div>

      </div>

      <div className="dashboardlayout-footer">
        <FooterAdmin />
      </div>

      <div id="modal-container"></div>

    </AdmDashLayout>
  )
}

const AdmDashLayout = styled.section`
       margin: auto;
    display: grid;
    width: 100%;
    max-width: 1920px;
    height: fit-content;
    min-height: 100vh;
    overflow: hidden;
    background: #fbfbfb;
    align-items: baseline;
    
    .dashboardlayout-header{
        display: grid;
        width: 100%;
        height: fit-content;
        box-shadow: 
        rgb(190, 188, 188) 1px 1px 3px, 
        rgb(190, 188, 188) -1px -1px 3px;
        
        padding: 12px;
        @media (max-width: 920px) {
            display: flex;
            justify-content: space-between;
        }
    }

    .dashboardlayout-dashavt{
        position: relative;
        display: grid;
        padding: 25px 90px 0;

        @media (max-width: 920px) {
            display: none;
        }
    }

    .dashboardlayout-contain{
        display: grid;
        position: relative;
        gap: 25px;
        padding: 25px;
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-columns: max-content 1fr;
        min-height: 100vh;
        // border: black 1px solid;
    }
    .dashboardlayout-container{
        display: grid;
        width: 100%;
        min-height: 100vh;
    }

    .dashboardlayout-footer{
        display: grid;
        width: 100%;
    }


  /* 🔥 botón menú */
  .menu-toggle{
    display: none;
    font-size: 22px;
    background: none;
    border: none;
    cursor: pointer;
  }

  /* 🔥 overlay */
  .overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: rgba(0,0,0,0.3);
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* 🔥 animación menú */
  .dashboardlayout-menud{
    transition: transform 0.25s ease, opacity 0.2s ease;
  }

  @media (max-width: 920px) {

    .menu-toggle{
      display: block;
    }

    .dashboardlayout-contain{
      grid-template-columns: 1fr;
       @media (max-width: 720px) {
         padding: 10px;
       }
    }

    .dashboardlayout-menud{
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 260px;
      z-index: 1000;
      transform: translateX(-100%);
      opacity: 0;
      
    }

    .dashboardlayout-menud.open{
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
