/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { formatPrice } from "../../../../globalActions";
import { BaseButton } from "../../../../index";
import { fetchOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";

export const OrdersComplete = () => {
  const allOrders = useSelector((state) => state.order.orderInfo || []);
  console.log(allOrders)
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const completeOrders = allOrders.filter(o => o.status === "approved");

  useEffect(() => {
    dispatch(fetchOrders()).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="sections">
        <h2>Pedidos completados</h2>
        <p>Cargando...</p>
      </section>
    );
  }

  return (
    <section className="sections">
      <h2>Pedidos completados</h2>

      {!completeOrders.length ? (
        <p>No hay pedidos completados</p>
      ) : (
        <div className="order-pending-list">
          {completeOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <strong>Pedido #{order.id}</strong>
                <span className="badge pending">Pendiente</span>
              </div>

              <div className="order-card-user">
                <p><strong>Usuario ID:</strong> {order.user_id}</p>
                <p><strong>Nombre:</strong> {order.name} {order.lastname}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Estado:</strong> {order.status}</p>
              </div>

              <div className="order-card-body">
                <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
              </div>
                <div className="order-card-actions">
                <BaseButton
                  textLabel
                  label="Aprobada"
                  icon="success"
                  img
                  classs={"button primary"}
                  colorbtn={"var(--success)"}
                  colortextbtnprimary={"var(--light)"}
                  colorbtnhoverprimary={"var(--success)"}
                  colortextbtnhoverprimary={"white"}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};