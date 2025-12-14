/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeLang } from '../../actions/userActions'; 
import { getFile } from '../../reducers/globalReducer';
import { useTranslation } from 'react-i18next';
import '../../assets/sass/lang.scss'

export const Lang = () => {
  const [defaulted, setDefaulted] = useState(localStorage.getItem('lang') || 'es');
  const lang = useSelector(state => state.langUI.lang);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
//   console.log(i18n)
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang]);

const handleChange = async (event) => {
    const selectedLang = event.target.value; // obtener datos del select
    await i18n.changeLanguage(selectedLang); // cambiar el idioma
    dispatch(changeLang({ lang: selectedLang })); //despachar el idioma en el contexto
    localStorage.setItem('lang', selectedLang ); // almacenar el idioma en localstorage
    window.location.reload();
  };

//   const handleLogout = () => {
//     dispatch(logout()).then(() => {
//       // Perform routing logic here after logout if needed
//     });
//   };

  return (
    <section className="lang">
      <div className="lang-box__select">
        <label htmlFor="lang">
        <img src={getFile('svg', `${defaulted}`, 'svg')} alt="" />
        </label>
        <select
          className="lang-box-lang lang__text"
          name="lang"
          id="lang"
          value={defaulted}
          onChange={handleChange}>
          <option className="lang__textop" value="en">EN</option>
          <option className="lang__textop" value="es">ES</option>
        </select>
      </div>
    </section>
  );
};

