/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-debugger */
// import { useLocation } from 'react-router-dom';
import { formatPrice } from '../../../globalActions';
import { BaseButton } from '../../components/globals/BaseButton';
import { useSelector } from 'react-redux';

export const CheckOut = () => {
    // const location = useLocation();
    // const {productInfo} = location.state;
    const productInfo = useSelector((state) => state.product.selectedProduct);
    const user = useSelector((state) => state.auth.user);
    
    
    return (
    <section className='checkout'>
        <div className='checkout-left'>
             <h2>Dirección de entrega</h2>
             <div className="checkout-info">
                 <p>Nombre:</p>
                 <strong>{user.name + ` `+ user.lastname}</strong>
             </div>
             <div className="checkout-info">
                 <p>Dirección:</p>
                 <strong>{user.address}</strong>
             </div>
             <div className="checkout-info">
                 <p>Ciudad</p>
                 <strong>{user.city}</strong>
             </div>
             <div className="checkout-info">
                 <p>Código postal</p>
                 <strong>{user.zipCode}</strong>
             </div>
             <div className='checkout-left'>
             <h2>Métodos de pago</h2>
             <p>Tarjetas</p>
             <p>Cuentas bancarias</p>
             <p>Moneybrokers</p>
            </div>
                <div className='checkout-left-img'>
                   <img src={productInfo.images?.[0]?.img_url} alt="" />
                   <div className='checkout-left-img-info'>
                       <h3>{productInfo.title}</h3>
                       <strong>{formatPrice(productInfo.previousPrice)}</strong>
                      <div className='checkout-left-info'>
                          {productInfo.description}   
                        
                      </div>
                   </div>
                </div>
             
        </div>

        <div className='checkout-right'>
            <h2>Resumen</h2>
            <div className='checkout-left-info'><h4>Coste total de los artículos</h4><p>COP {formatPrice(productInfo.previousPrice)}</p></div>
             <div className='checkout-left-info'><h4>Código promocional</h4><p>Escribe el código aquí</p></div>
             <div className='checkout-left-info'><h4>Total de envío</h4><p>Gratis</p></div>
             <div className='checkout-left-info'><h4>Total</h4><strong>COP {formatPrice(productInfo.previousPrice)}</strong></div>
            <BaseButton 
                icon={"pay"}
                classs={'button primary'} 
                colorbtn={"var(--bg-primary)"}
                colortextbtnprimary={"var(--light)"}
                colorbtnhoverprimary={"var(--bg-primary-tr)"}
                colortextbtnhoverprimary={"white"}   
                label={"Pagar pedido"} 
                link={'/'} 
            />
            <p>
                Al hacer click en 'Realizar pedido', confirmo haber 
                leído y aceptado los términos y condiciones.
            </p>
        </div>
    </section>
  )
}
