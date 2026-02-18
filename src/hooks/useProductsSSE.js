import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setProduct } from "../actions/productActions";

export const useProductsSSE = () => {
  const dispatch = useDispatch();
  const sseRef = useRef(null);

  useEffect(() => {
    // 🚫 Evitar múltiples conexiones
    if (sseRef.current) return;

    const url = `${import.meta.env.VITE_APP_API_URL}/products/stream`;

    const eventSource = new EventSource(url, {
      withCredentials: true,
    });

    sseRef.current = eventSource;

    eventSource.addEventListener("products", (event) => {
      try {
        const incoming = JSON.parse(event.data);

        // 🔄 Actualizar Redux
        dispatch(setProduct(incoming));

        // 💾 Persistir
        localStorage.setItem("products", JSON.stringify(incoming));
      } catch (error) {
        console.error("❌ Error parseando SSE products:", error);
      }
    });

    eventSource.onerror = () => {
      console.warn("⚠️ SSE desconectado");
      eventSource.close();
      sseRef.current = null;
    };

    return () => {
      eventSource.close();
      sseRef.current = null;
    };
  }, [dispatch]);
};
