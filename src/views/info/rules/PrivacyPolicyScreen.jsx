
// import { PrintRoutes } from '../../components/globals/PrintRoutes';
import { useLocation } from 'react-router-dom';
export const PrivacyPolicyScreen = () => {
  const footerLocation = useLocation();


  return (
    <section className="tycsection">
        <div className="tycsection-header">
            <span>{`home${footerLocation.pathname.replace(/\//g, ' > ')}`}</span>
            <h2>Política de privacidad</h2>
        </div>
        <div className="tycsection-rules">
<h1>POLÍTICA DE PRIVACIDAD Y TRATAMIENTO DE DATOS PERSONALES</h1>
<h2>ALISUPER – TIENDA VIRTUAL</h2>

<p><strong>Fecha de entrada en vigencia:</strong> [Agregar fecha]</p>

<p>En cumplimiento de lo dispuesto en la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas concordantes que regulan la protección de datos personales en Colombia, la tienda virtual <strong>ALISUPER</strong> adopta la presente Política de Privacidad y Tratamiento de Datos Personales.</p>

<h2>1. IDENTIFICACIÓN DEL RESPONSABLE DEL TRATAMIENTO</h2>

<p><strong>Razón social:</strong> ALISUPER</p>
<p><strong>Domicilio:</strong> Colombia</p>
<p><strong>Correo electrónico de contacto:</strong> [Agregar correo oficial]</p>
<p><strong>Teléfono:</strong> [Agregar número de contacto]</p>

<p>ALISUPER es responsable del tratamiento de los datos personales recolectados a través de su tienda virtual.</p>

<h2>2. DATOS PERSONALES QUE SE RECOLECTAN</h2>

<p>ALISUPER podrá recolectar los siguientes datos personales:</p>

<ul>
  <li>Nombre y apellidos</li>
  <li>Número de identificación</li>
  <li>Dirección de domicilio</li>
  <li>Número telefónico</li>
  <li>Correo electrónico</li>
  <li>Información de facturación</li>
  <li>Información relacionada con medios de pago (procesada por plataformas seguras de terceros)</li>
  <li>Dirección IP y datos de navegación</li>
</ul>

<h2>3. FINALIDAD DEL TRATAMIENTO DE LOS DATOS</h2>

<p>Los datos personales recolectados serán utilizados para las siguientes finalidades:</p>

<ul>
  <li>Procesar y gestionar pedidos realizados en la tienda virtual.</li>
  <li>Realizar envíos de productos adquiridos.</li>
  <li>Emitir facturas y comprobantes de pago.</li>
  <li>Brindar atención al cliente.</li>
  <li>Enviar información relacionada con promociones, ofertas y novedades (previa autorización).</li>
  <li>Cumplir obligaciones legales y contractuales.</li>
  <li>Mejorar la experiencia del usuario en la plataforma.</li>
</ul>

<h2>4. DERECHOS DEL TITULAR DE LOS DATOS</h2>

<p>De acuerdo con la legislación colombiana, el titular de los datos personales tiene derecho a:</p>

<ul>
  <li>Conocer, actualizar y rectificar sus datos personales.</li>
  <li>Solicitar prueba de la autorización otorgada para el tratamiento.</li>
  <li>Ser informado respecto al uso que se le ha dado a sus datos.</li>
  <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
  <li>Revocar la autorización y/o solicitar la supresión del dato cuando no se respeten los principios, derechos y garantías legales.</li>
  <li>Acceder gratuitamente a sus datos personales.</li>
</ul>

        </div>

    </section>
  )
}
