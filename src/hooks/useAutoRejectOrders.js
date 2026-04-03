import { useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const useAutoRejectOrders = (rejectUrl, onAfterAction, intervalMinutes = 30) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!rejectUrl) return;

    const checkExpiredOrders = async () => {
      try {
        const tokenAdmin = localStorage.getItem("tokenAdmin");
        
        if (!tokenAdmin) return;

        const response = await axios.post(
          rejectUrl,
          {},
          {
            headers: {
              "x-token": tokenAdmin,
            },
          }
        );

        if (response.data.rejectedOrders?.length > 0) {
          // Mostrar notificación de órdenes rechazadas
          Swal.fire({
            icon: "info",
            title: "Órdenes rechazadas automáticamente",
            text: `Se rechazaron ${response.data.rejectedOrders.length} órdenes sin comprobante después de 8 horas`,
            timer: 5000,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
          });
          
          // Actualizar la lista de órdenes
          if (onAfterAction) onAfterAction();
        }
      } catch (error) {
        console.error("Error checking expired orders:", error);
      }
    };

    // Verificar inmediatamente al montar
    checkExpiredOrders();

    // Configurar intervalo para verificar periódicamente
    intervalRef.current = setInterval(checkExpiredOrders, intervalMinutes * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [rejectUrl, onAfterAction, intervalMinutes]);
};