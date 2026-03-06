/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { formatPrice } from "../../../../globalActions";
import { BaseButton } from "../../../../index";
import { fetchOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { OrdersList } from "../../../components/globals/OrdersList";

export const OrdersComplete = () => {
  const allOrders = useSelector((state) => state.order.orderInfo || []);
  const dispatch = useDispatch();

    useEffect(() => {
    dispatch(fetchOrders());
  }, []);
  return (

        <>
          <OrdersList
            title="Pedidos completados y enviados"
            orders={allOrders}
            statusFilter="approved"
            enableStream
            streamUrl={`${import.meta.env.VITE_APP_API_URL}/orders/stream`}
            onAfterAction={() => dispatch(fetchOrders())}
          />
        </>
  );
};