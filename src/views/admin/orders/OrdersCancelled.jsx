import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../actions/orderActions";
import { useEffect } from "react";
import { OrdersList } from "../../../components/globals/OrdersList";


export const OrdersCancelled = () => {
  const allOrders = useSelector((state) => state.order.orderInfo || []);
  const dispatch = useDispatch();

    useEffect(() => {
    dispatch(fetchOrders());
  }, []);
  return (

        <>
          <OrdersList
            title="Pedidos cancelados"
            orders={allOrders}
            statusFilter="cancelled"
            enableStream
            streamUrl={`${import.meta.env.VITE_APP_API_URL}/orders/stream`}
            onAfterAction={() => dispatch(fetchOrders())}
          />
        </>
  );
};