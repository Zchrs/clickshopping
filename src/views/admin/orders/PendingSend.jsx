
import { fetchOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { OrdersList } from "../../../components/globals/OrdersList";
import { useEffect } from "react";

export const PendingSend = () => {
  const allOrders = useSelector((state) => state.order.orderInfo || []);
  const dispatch = useDispatch();
  
    useEffect(() => {
    dispatch(fetchOrders());
  }, []);
  
  return (
    <>
      <OrdersList
        title="Pedidos pendientes de envío"
        orders={allOrders}
        statusFilter="pending shipment"
        approveUrl={import.meta.env.VITE_APP_API_APPROVE_SEND_ORDER_URL}
        enableStream
        labelBtn={"Enviar pedido"}
        streamUrl={`${import.meta.env.VITE_APP_API_URL}/orders/stream`}
        onAfterAction={() => dispatch(fetchOrders())}
        confirmTextBtn={"Aprobar envío"}
        cancelTextBtn={"Volver"}
      />
    </>
  );
};
