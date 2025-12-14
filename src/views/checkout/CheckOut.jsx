/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-debugger */
// import { useLocation } from 'react-router-dom';
import { BaseButton } from '../../components/globals/BaseButton';
import { getFile } from '../../reducers/globalReducer';
import { useSelector } from 'react-redux';

export const CheckOut = () => {
    // const location = useLocation();
    // const {productInfo} = location.state;
    const productInfo = useSelector((state) => state.product);
    // console.log(productInfo)
    
    
    return (
    <section className='checkout'>
        <div className='checkout-left'>
             <h2>dirección de entrega</h2>
             <p>Nombre</p>
             <p>Dirección</p>
             <p>País, departamento, ciudad, postal</p>
             <div className='checkout-left'>
             <h2>Métodos de pago</h2>
             <p>Tarjetas</p>
             <p>Cuentas bancarias</p>
             <p>Moneybrokers</p>
            </div>
             <div className='checkout-left-img'>
                <img src={getFile('jpg', `${productInfo.thumbnails[0]}`, 'jpg')} alt="" />
                <div>
                    <h3>{productInfo.title}</h3>
                    <strong>{productInfo.price}</strong>
                </div>
             </div>
             
        </div>

        <div className='checkout-right'>
            <h2>Resumen</h2>
            <div className='checkout-left-info'><h4>Coste total de los artículos</h4><p>COP {productInfo.price}</p></div>
             <div className='checkout-left-info'><h4>Código promocional</h4><p>Escribe el código aquí</p></div>
             <div className='checkout-left-info'><h4>Total de envío</h4><p>Gratis</p></div>
             <div className='checkout-left-info'><h4>Total</h4><strong>COP {productInfo.price}</strong></div>
            <BaseButton classs={"button full-red"} label={"Realizar compra"} link={'/'} />
            <p>Al hacer click en 'Realizar pedido', confirmo haber leído y aceptado los términos y condiciones.</p>
        </div>
    </section>
  )
}
