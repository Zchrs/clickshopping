/* eslint-disable no-unused-vars */
import { fetchOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { OrdersList } from "../../../components/globals/OrdersList";
import { useEffect } from "react";

export const OrdersPending = () => {
  const allOrders = useSelector((state) => state.order.orderInfo || []);
  const dispatch = useDispatch();

    useEffect(() => {
    dispatch(fetchOrders());
  }, []);
 
  return (
    <section className="section-grid">
    <OrdersList
      title="Pedidos pendientes"
      orders={allOrders}
      statusFilter="pending aproval"
      approveUrl={import.meta.env.VITE_APP_API_APPROVE_ORDER_URL}
      enableStream
      labelBtn={"Aprobar"}
      streamUrl={`${import.meta.env.VITE_APP_API_URL}/orders/stream`}
      onAfterAction={() => dispatch(fetchOrders())}
      confirmTextBtn={"Aprobar pedido"}
      cancelTextBtn={"Volver"}
    />
    </section>
  );
};
