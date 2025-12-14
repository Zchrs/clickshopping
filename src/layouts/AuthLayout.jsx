import { getFile } from "../reducers/globalReducer"
import { AuthRouter } from "../router/AppRouter"
import { Link, NavLink } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { startChecking } from "../actions/authActions";
import './authlayout.scss'

export const AuthLayout = () => {

  const dispatch = useDispatch();

  const lang = useSelector(state => state.langUI.lang);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    dispatch(startChecking());
  }, [i18n, lang, dispatch]);

  return (
    <section className="authlayout">
      <div className="authlayout-header">
        <div className="authlayout-header-logo">
          <Link to={"/"}><img src={getFile('svg', 'logo', 'svg')} alt="" /></Link>
        </div>
      </div>
      <div className="authlayout-container">
      <div className="authlayout-container-group">
        <NavLink className={ ({isActive}) => ` ${ isActive ? 'active' : '' } ` } to={"/auth/register"}>{t('auth.newAccount')}</NavLink> 
        <NavLink className={ ({isActive}) => ` ${ isActive ? 'active' : '' } ` } to={"/auth/login"}>{t('auth.login')}</NavLink>
      </div>
        <AuthRouter />
      </div>
      <div className="authlayout-footer">

      </div>
    </section>
  )
}
