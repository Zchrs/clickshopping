/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchUserOrdersById } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { OrdersListUser } from "../../../components/globals/OrdersListUser";


export const OrdersPending = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orderInfo || []);
  const [loading, setLoading] = useState(false);
const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
       
        const result = dispatch(fetchUserOrdersById());
        
      } catch (error) {
        console.error("❌ Error cargando órdenes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, [dispatch]);

const handleSendProof = async (orderId, image) => {
  try {
    const token = user?.token; // 🔥 CORRECTO

    if (!token) {
      console.error("❌ No hay token de autenticación");
      return;
    }

    const encodedOrderId = encodeURIComponent(orderId);

    await axios.post(
      `${import.meta.env.VITE_APP_API_SEND_PAYMENT_PROOF_URL}/${encodedOrderId}`,
      {
        img_url: image.url,
        image_public_id: image.public_id ?? null,
      },
      {
        headers: {
          "x-token": token,
        },
      }
    );

    dispatch(fetchUserOrdersById());

  } catch (error) {
    console.error(error);
  }
};
  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando tus pedidos...</p>
      </div>
    );
  }

  return (
    <OrdersListUser
      title="Pendientes de validación del pago"
      note="Aquí puedes ver el estado de tus pedidos pendientes de validación del pago"
      orders={orders}
      statusFilter="pending approval"
      emptyMessage="No tienes pedidos pendientes de aprobación"
      onSendProof={handleSendProof}
    />
  );
};