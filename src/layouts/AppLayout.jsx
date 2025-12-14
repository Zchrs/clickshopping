
import { Footer } from "../components/globals/Footer"
import { Header } from "../components/globals/Header"
import { AppRouter } from "../router/AppRouter"
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { startChecking } from "../actions/authActions";
import './applayout.scss'






export const AppLayout = () => {
    
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(startChecking());
    }, [dispatch]);


  return (
    <section className="layout">
    <section className="layout__container">
        <header className="layout-header">
            <div className="layout-header__container">
                <Header />
            </div>
        </header>
        <section className="layout-container">
            <div className="layout-container__contain">
                <AppRouter />
            </div>
        </section>
        <footer className="layout-footer">
            <Footer />
        </footer>
    </section>
    <div id="modal-container">
    </div>
    <div id='swiper-container'>
    </div>
</section>
  )
}
