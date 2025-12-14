/* eslint-disable react-hooks/exhaustive-deps */
import { NavLink } from "react-router-dom";
import { getFile } from "../../reducers/globalReducer";
import { BoxInfo } from "./BoxInfo";
import { InputSearch } from "./InputSearch";
import { BaseButton } from "./BaseButton";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { startChecking } from "../../actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { Lang } from "./Lang";



import '../../assets/sass/header.scss'
import { Avatar } from "./Avatar";

 

export const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const buttonsList = [
    {
      name: 'home',
      route: 'home',
      text: t('globals.home'),
    },
    {
      name: 'aliments',
      route: 'categories/aliments',
      text: t('globals.foods'),
    },
    {
      name: 'technology',
      route: 'categories/technology',
      text: t('globals.technology'),
    },
    {
      name: 'clothing',
      route: 'categories/clothing',
      text: t('globals.clothing'),
    },
  ];
  // const { menuList, buttonsList } = props;
  const [ menuFixed, UseMenuFixed ] = useState(false)
  
   
// Montaje/ejecución del componente
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        UseMenuFixed(true);
      } else {
        UseMenuFixed(false);
      }

      dispatch(startChecking());
    };

    window.addEventListener('scroll', handleScroll);

// quitando el listener en el desmontaje/cambio de pantalla 
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="head">
      <div className={menuFixed ? 'head-top' : 'head-top'} >
        <div className="head-logo">
          <img src={getFile('svg', 'logo', 'svg')} alt="Logo" />
        </div>
        <div className="head-btns">
            {!user ?
            <div className="head-btns-div">
              <BaseButton label={t('auth.login')} classs="button small-red" link={"auth/login"} />
              <BaseButton label={t('auth.register')} classs="button small-outline-red" link={"auth/register"} />
            </div>
              : <div className="head-btns-div-avatar">
                <Avatar dropData={true} img={"default-avatar"} avtsmall={true} clas={"avatar tumb"} />
              </div>
            }
        </div>
        <div className="head-top__menu">
          <ul>
            {!user ? <BoxInfo
              arrow={true}
              icon="user-red"
              btns={true}
              title={t('auth.welcome')}
              social={true}
            /> : false }
            {!user ? <BoxInfo
              arrow={true}
              icon="cart-red"
              title={t('cart.empty')}
              text={t('auth.login')}
              textA="o"
              textB={t('auth.register')}
              emptyCart={true}
              img="empty-cart"
              texts={true}
            /> 
            :
              <BoxInfo
              arrow={true}
              icon="cart-red"
              title={t('cart.empty')}
              newUser={true}
              textU={t('cart.dare')}
              emptyCart={true}
              textT={true}
              img="empty-cart"
            /> 
            }
            { !user ?
              <BoxInfo
              arrow={true}
              icon="letter"
              texts={true}
              titleA={t('comunications.noMessage')}
              textC={t('globals.messages')}
              btnlogin={true}
              newUser={true}
              textD={t('globals.newCustomer')}
              img="no-message"
            />
            :
            <BoxInfo
            arrow={true}
            icon="letter"
            texts={true}
            titleA={t('comunications.noMessage')}
            newUser={true}
            img="no-message"
          />
            }
            <Lang /><ul>
              
              { !user ?
                <NavLink className="head-top-a" to="/auth/register">
                  <li>{t('auth.newAccount')}</li>
                </NavLink>
                : false
              }
              <NavLink><li>{t('globals.help')}</li></NavLink>
            </ul>
            {user ? <Avatar dropData={true} img={"default-avatar"} avtsmall={true} clas={"avatar tumb"} /> : false}
          </ul>

        </div>
      </div>

      <div className="head-menu">
        <div className="head-menu__container">
        <div className="head-menu__container-lang">
          <Lang />
        </div>
          <div>
            <InputSearch clas="inputSearch large" />
          </div>
          <ul>
            {buttonsList.map((item, index) => (
              
              <NavLink to={item.route} key={index}>
                <li>{item.text}</li>
              </NavLink>
            ))}
          </ul>
        </div>
      </div>
            
      
    </div>
  );
}
