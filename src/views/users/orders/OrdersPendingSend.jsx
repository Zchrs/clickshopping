/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { fetchUserOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { OrdersListUser } from "../../../components/globals/OrdersListUser";

export const OrdersPendingSend = () => {
  const orders = useSelector((state) => state.order.orderInfo || []);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);


  return (
        <>
          <OrdersListUser
            title="Pago verificado y pendientes de envío"
            orders={orders}
            statusFilter="pending send"
            enableStream
            streamUrl={`${import.meta.env.VITE_APP_API_URL}/cart/stream`}
            onAfterAction={() => dispatch(fetchUserOrders())}
          />
        </>
  );
};

