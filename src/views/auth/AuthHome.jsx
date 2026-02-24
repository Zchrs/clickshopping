import { Link } from "react-router-dom"
import { AuthRouter } from "../../router/AppRouter"
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";
import { useSelector } from 'react-redux';

const grid = {
    display: 'grid',
}

export const AuthHome = () =>{
    const lang = useSelector(state => state.langUI.lang);
    const { t, i18n } = useTranslation();
    useEffect(() => {
        i18n.changeLanguage(lang);
      }, [i18n, lang]);



    return (
        <section className="authhome" style={ grid }>
          <h1>Bienvenido</h1>

          <Link to={'/register'}>{t('auth.newAccount')}</Link>
          <Link to={'/login'}>{t('auth.login')}</Link>
          <Link to={'/'}>{t('globals.backHome')}</Link>

          <AuthRouter />
        </section>
    )
}
