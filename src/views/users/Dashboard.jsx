/* eslint-disable no-unused-vars */
import { CardProductsSmall } from '../../components/globals/CardProductsSmall'
import { getFile } from '../../reducers/globalReducer'
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { startChecking } from "../../actions/authActions";

import '../../assets/sass/dashboard.scss'


export const Dashboard = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [ appeals, setAppeals ] = useState([]);
  const [ refunds, setRefunds ] = useState([]);
  const [loading, setLoading] = useState(false);

  const lang = useSelector(state => state.langUI.lang);

      useEffect(() => {
        dispatch(startChecking());
          i18n.changeLanguage(lang);
        }, [i18n, lang, dispatch]);

  return (
    <section className='dashbuser'>
      <div className="dashbuser-header">
        <div className="dashbuser-items"><img src={getFile('svg', 'wishlist', 'svg')} alt="" /><p>{t('dashboard.wishlist')}</p></div>
        <div className="dashbuser-items"><img src={getFile('svg', 'following', 'svg')} alt="" /><p>{t('globals.following')}</p></div>
        <div className="dashbuser-items"><img src={getFile('svg', 'followers', 'svg')} alt="" /><p>{t('globals.follow')}</p></div>
        <div className="dashbuser-items"><img src={getFile('svg', 'coupons', 'svg')} alt="" /><p>{t('globals.coupons')}</p></div>
      </div>
      <div className="dashbuser-contain">
        <div className="dashbuser-orders-grid">
          <h2>
          {t('dashboard.orders')}
          </h2>
        <div className="dashbuser-orders-contain">
          <div className="dashbuser-group">
            <div className="dashbuser-orders-items"><img src={getFile('svg', 'wallet-red-full', 'svg')} alt="" /><p>{t('dashboard.pendingPay')}</p></div>
            <div className="dashbuser-orders-items"><img src={getFile('svg', 'send-pending-red', 'svg')} alt="" /><p>{t('dashboard.pendingSend')}</p></div>
            <div className="dashbuser-orders-items"><img src={getFile('svg', 'send-red', 'svg')} alt="" /><p>{t('dashboard.sent')}</p></div>
            <div className="dashbuser-orders-items"><img src={getFile('svg', 'ratings-red', 'svg')} alt="" /><p>{t('dashboard.ratings')}</p></div>
          </div>
        </div>
        </div>
        <hr className='dashbuser-hr' />
        <div className="dashbuser-orders">
          <h3>
            {t('dashboard.appeals')}
          </h3>
          <div className="dashbuser-orders-inside">
          {loading ? (
            <p>{t("dashboard.appealsText")}</p>
          ) : appeals.length === 0 ? (
            <p>{t("dashboard.appealsText")}</p>
          ) : (
            appeals.map((item) => (
              <div key={item.index}>
              </div>
            ))
          )}
          <img src={getFile("svg", "box-empty","svg")} alt="" />
          </div>
        </div>
        <hr className='dashbuser-hr' />
        <div className="dashbuser-orders">
          <h3>
            {t('dashboard.refunds')}
          </h3>
          <div className="dashbuser-orders-inside">
          {loading ? (
            <p>{t("dashboard.refundsText")}</p>
          ) : appeals.length === 0 ? (
            <p>{t("dashboard.refundsText")}</p>
          ) : (
            refunds.map((item) => (
              <div key={item.index}>

              </div>
            ))
          )}
          <img src={getFile("svg", "box-empty","svg")} alt="" />
          </div>
        </div>
        <hr className='dashbuser-hr' />
        <div className="dashbuser-orders-grid">
          <h2>
          {t('dashboard.wouldLike')}
          </h2>
        <div className="dashbuser-orders-int">
          <CardProductsSmall
          addToWish={"addwishlist-red"}
          addTocart={"addcart-red"}
          img3={"maiz"}
          sellingsText={true}
          sellings={"999 Vendidos"}
          priceText={true}
          price="Cop $3.325"
          jpg3="true"
        />
          <CardProductsSmall
          addToWish={"addwishlist-red"}
          addTocart={"addcart-red"}
          img3={"maiz"}
          sellingsText={true}
          sellings={"999 Vendidos"}
          priceText={true}
          price="Cop $3.325"
          jpg3="true"
        />
          <CardProductsSmall
          addToWish={"addwishlist-red"}
          addTocart={"addcart-red"}
          img3={"maiz"}
          sellingsText={true}
          sellings={"999 Vendidos"}
          priceText={true}
          price="Cop $3.325"
          jpg3="true"
        />
          <CardProductsSmall
          addToWish={"addwishlist-red"}
          addTocart={"addcart-red"}
          img3={"maiz"}
          sellingsText={true}
          sellings={"999 Vendidos"}
          priceText={true}
          price="Cop $3.325"
          jpg3="true"
        />
        </div>
        
        </div>
        
      </div>

       
      
    </section>
  )
}
