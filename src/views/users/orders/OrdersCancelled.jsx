import { useEffect } from "react";
import { OrdersListUser } from "../../../components/globals/OrdersListUser";
import { fetchUserOrdersById } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";


export const OrdersCancelled = () => {
  const orders = useSelector((state) => state.order.orderInfo || []);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchUserOrdersById());
  }, []);

  return (
    <section className="sections">
          <OrdersListUser
            title="Pedidos cancelados"
            note="Aquí puedes ver el estado de tus pedidos cancelados"
            orders={orders}
            statusFilter="cancelled"
            emptyMessage="No hay pedidos cancelados"
          />
    </section>
  );
};