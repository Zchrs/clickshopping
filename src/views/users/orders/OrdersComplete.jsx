/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { fetchUserOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { OrdersListUser } from "../../../components/globals/OrdersListUser";

export const OrdersComplete = () => {
  const orders = useSelector((state) => state.order.orderInfo || []);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);

  return (
    <section className="sections">
          <OrdersListUser
            title="Pedidos completados y enviados"
            orders={orders}
            statusFilter="approved"
            emptyMessage="No hay pedidos pendientes"
          />
    </section>
  );
};