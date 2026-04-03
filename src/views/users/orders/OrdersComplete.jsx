/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { fetchUserOrdersById } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { OrdersListUser } from "../../../components/globals/OrdersListUser";

export const OrdersComplete = () => {
  const orders = useSelector((state) => state.order.orderInfo || []);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchUserOrdersById());
  }, []);

  return (
    <section className="sections">
          <OrdersListUser
            title="Pedidos completados y enviados"
            note="Aquí puedes ver el estado de tus pedidos enviados"
            orders={orders}
            statusFilter="shipped"
            emptyMessage="No hay pedidos pendientes"
          />
    </section>
  );
};