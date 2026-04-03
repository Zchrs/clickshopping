/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { fetchUserOrdersById } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { OrdersListUser } from "../../../components/globals/OrdersListUser";

export const OrdersPendingSend = () => {
  const orders = useSelector((state) => state.order.orderInfo || []);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchUserOrdersById());
  }, []);


  return (
        <>
          <OrdersListUser
            title="Pago verificado y pendientes de envío"
            note="Aquí puedes ver el estado de tus pedidos en proceso de envíos"
            orders={orders}
            statusFilter="pending shipment"
            enableStream
            streamUrl={`${import.meta.env.VITE_APP_API_URL}/cart/stream`}
            onAfterAction={() => dispatch(fetchUserOrdersById())}
          />
        </>
  );
};

