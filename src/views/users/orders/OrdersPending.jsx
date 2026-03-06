/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchUserOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { OrdersListUser } from "../../../components/globals/OrdersListUser";

export const OrdersPending = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orderInfo || []);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleSendProof = async (orderId, image) => {
    await axios.post(
      `${import.meta.env.VITE_APP_API_SEND_PAYMENT_PROOF_URL}/${orderId}`,
      {
        img_url: image.url,
        image_public_id: image.public_id ?? null,
      },
      {
        headers: {
          "x-token": localStorage.getItem("tokenUser"),
        },
      }
    );

    dispatch(fetchUserOrders());
  };

  return (
    <OrdersListUser
      title="Pendientes de validación del pago"
      orders={orders}
      statusFilter="pending aproval"
      emptyMessage="No hay pedidos pendientes"
      onSendProof={handleSendProof}
    />
  );
};