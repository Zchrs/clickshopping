/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatPrice } from "../../../globalActions";
import { BaseButton } from "../../components/globals/BaseButton";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export const CheckOut = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [paying, setPaying] = useState(false);

  const products = state?.products || [];

  const subtotal = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  // ✅ HANDLE PAY REAL
const handlePay = async () => {
  if (!user) {
    Swal.fire("Debes iniciar sesión", "Inicia sesión para pagar", "warning");
    return;
  }

  if (!products.length) {
    Swal.fire("Carrito vacío", "No hay productos para pagar", "info");
    return;
  }

  setPaying(true);

  Swal.fire({
    title: "Procesando pedido...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const res = await axios.post(
      import.meta.env.VITE_APP_API_PAY_ORDER_URL,
      {
        user_id: user.id,
        product_ids: products.map(p => p.product_id),
      }
    );

    Swal.fire({
      icon: "success",
      title: "Pedido creado",
      text: res.data.message || `
      Pedido pendiente de aprobación, por motivos de 
      seguridad, ve a la sección "Pedidos" y envía 
      el comprobante de pago para proceder con el envío.
      `,
        customClass: {
          popup: 'swal-custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'swal-confirm-btn',
        },
    });

    navigate("/dashboard/orders");
  } catch (error) {
    Swal.fire({
     icon: "error",  
     text: error?.response?.data?.error || "No se pudo crear el pedido",
      customClass: {
        popup: 'swal-custom-popup',
        title: 'custom-title',
        content: 'custom-content',
        confirmButton: 'swal-confirm-btn',
      },
    });
  } finally {
    setPaying(false);
  }
};


  if (!products.length) {
    return (
      <section className="checkout">
        <h2>No hay productos para pagar</h2>
        <BaseButton
          textLabel
          classs={"button primary"}
          $colorbtn={"var(--bg-primary)"}
          $colortextbtnprimary={"var(--light)"}
          $colorbtnhoverprimary={"var(--bg-primary-tr)"}
          $colortextbtnhoverprimary={"white"}
          label="Volver al carrito"
          handleClick={() => navigate("/dashboard/my-cart")}
        />
      </section>
    );
  }

  return (
    <section className="checkout">
      <div className="checkout-left">
        <h2>Dirección de entrega</h2>
        <div className="checkout-info">
          <p>Nombre:</p>
          <strong>{user.name} {user.lastname}</strong>
        </div>
        <div className="checkout-info">
          <p>Dirección:</p>
          <strong>{user.address}</strong>
        </div>
        <div className="checkout-info">
          <p>Ciudad:</p>
          <strong>{user.city}</strong>
        </div>
        <div className="checkout-info">
          <p>Código postal:</p>
          <strong>{user.zipCode}</strong>
        </div>

        <h2>Métodos de pago</h2>
        <p>Tarjetas</p>
        <p>Cuentas bancarias</p>
        <p>Moneybrokers</p>

        {/* 🔥 PRODUCTOS */}
        <div className="checkout-left-boxproducts">
          {products.map((item) => (
            <div key={item.product_id} className="checkout-left-img">
              <img
                src={Array.isArray(item.img_urls) ? item.img_urls[0] : item.img}
                alt={item.name}
              />
              <div className="checkout-left-img-info">
                <h3>{item.name}</h3>
                <strong>{formatPrice(item.price)}</strong>
                <div className="checkout-left-info">
                  Cantidad: {item.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="checkout-right">
        <h2>Resumen</h2>
        <div className="checkout-left-info">
          <h4>Coste total de los artículos</h4>
          <p>COP {formatPrice(subtotal)}</p>
        </div>
        <div className="checkout-left-info">
          <h4>Código promocional</h4>
          <p>Escribe el código aquí</p>
        </div>
        <div className="checkout-left-info">
          <h4>Total de envío</h4>
          <p>Gratis</p>
        </div>
        <div className="checkout-left-info">
          <h4>Total</h4>
          <strong>COP {formatPrice(subtotal)}</strong>
        </div>

        <BaseButton
          icon={"pay"}
          label={paying ? "Procesando..." : "Pagar pedido"}
          textLabel
          disabled={paying}
          classs={"button primary"}
          $colorbtn={"var(--bg-primary)"}
          $colortextbtnprimary={"var(--light)"}
          $colorbtnhoverprimary={"var(--bg-primary-tr)"}
          $colortextbtnhoverprimary={"white"}
          handleClick={handlePay}
        />

        <p>
          Al hacer click en 'Realizar pedido', confirmo haber leído y aceptado los
          términos y condiciones.
        </p>
      </div>
    </section>
  );
};
