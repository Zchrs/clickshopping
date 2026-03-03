/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { formatPrice, getFile } from "../../../../globalActions";
import { BaseButton } from "../../../../index";
import { fetchUserOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const OrdersPendingSend = () => {
  const allOrders = useSelector((state) => state.order.orderInfo || []);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const pendingOrders = allOrders.filter(o => o.status === "pending send");

  useEffect(() => {
    dispatch(fetchUserOrders()).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="sections">
        <h2>Pedidos pendientes</h2>
        <p>Cargando...</p>
      </section>
    );
  }

  return (
    <section className="sections">
      <h2>Pendientes de envío</h2>

      {!pendingOrders.length ? (
        <p>No hay pedidos pendientes</p>
      ) : (
        <div className="orders-pending-list">
          {pendingOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <strong>Pedido #{order.id}</strong>
                <span className="badge pending">Pendiente</span>
              </div>

                  <div className="orders-card-user">
                    <p>
                      <strong>Nombre:</strong>{" "}
                      {order.name || order.user?.name}{" "}
                      {order.lastname || order.user?.lastname}
                    </p>
                    <p><strong>Email:</strong> {order.email || order.user?.email}</p>
                    <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                    <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <p><strong>Estado:</strong> {order.status}</p>
                  

              <div className="order-card-body">
                <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
              </div>
              <LinK>
<a
  href={`https://wa.me/573173595203?text=${encodeURIComponent(
    `Hola, soy ${order.name || order.user?.name} ${order.lastname || order.user?.lastname} tengo un pedido pendiente (#${order.id}) y necesito ayuda.`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <img src={getFile("svg", "whatsapp-logo", "svg")} alt="WhatsApp" />
  ¿24 horas y aún pendiente? Escríbenos ahora y juntos lo resolveremos.
</a>
              </LinK>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const LinK = styled.div`
  a{
    display: flex;
    color: var(--dark);
    align-items: center;
    width: 100%;
    height: fit-content;
    gap: 5px;
    &:hover{
      color: var(--primary);
    }
  }
  img{
    width: 40px;
  }
`