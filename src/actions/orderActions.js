/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import axios from "axios";
import { types } from "../types/types";
import { io } from "socket.io-client";

export const setOrder = (orderInfo) => {
  return {
    type: types.orderView,
    payload: Array.isArray(orderInfo) ? orderInfo : [],
  };
};

export const selectedOrder = (orderInfo) => ({
  type: types.SELECTED_ORDER,
  payload: orderInfo,
});

export const updateOrder = (orderInfo) => ({
  type: types.UPDATE_ORDER,
  payload: Array.isArray(orderInfo) ? orderInfo : [],
});

  export const startPayment = (orderInfo) => {
    return {
      type: types.startPayment,
      payload: Array.isArray(orderInfo) ? orderInfo : [],
    };
  };

  export const paymentSuccess = (orderInfo) => {
    return {
      type: types.paymentSuccess,
      payload: Array.isArray(orderInfo) ? orderInfo : [],
    };
  };

  export const errorPayment = (orderInfo) => {
    return {
      type: types.errorPayment,
      payload: Array.isArray(orderInfo) ? orderInfo : [],
    };
  };

  


export const fetchOrders = () => async (dispatch) => {
  try {
    const tokenAdmin = localStorage.getItem("tokenAdmin");

    if (!tokenAdmin) {
      console.error("❌ No hay token admin");
      dispatch(setOrder([]));
      return;
    }

    const { data } = await axios.get(
      import.meta.env.VITE_APP_API_GET_ORDERS_URL,
      {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          "x-token": tokenAdmin,
        },
      }
    );

    const orders = data.orders || [];

    // 🔥 Formatear órdenes incluyendo los datos del comprobante
    const formattedOrders = orders.map((order) => ({
      ...order,
      // Datos del usuario
      user: order.user || {
        id: order.guest_id || order.user_id || "",
        name: order.name || "Invitado",
        lastname: order.lastname || "",
        email: order.email || "",
      },
      // 🔥 Datos del comprobante (importante para mostrar en el frontend)
      payment_proof: order.payment_proof || null,
      proof_img: order.payment_proof?.img_url || null,
      proof_status: order.payment_proof?.status || null,
      // Totales
      total: Number(order.total) || 0,
      products: order.products || [],
    }));


    localStorage.setItem("ordersAdmin", JSON.stringify(formattedOrders));
    localStorage.setItem("ordersAdmin_last_update", new Date().getTime());
    dispatch(setOrder(formattedOrders));

    return formattedOrders;
  } catch (error) {
    console.error("❌ Error al obtener las órdenes:", error);
    dispatch(setOrder([]));
    throw error;
  }
};

export const fetchUserOrders = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      import.meta.env.VITE_APP_API_GET_USER_ORDERS_URL,
      {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const orders = (data.orders || []).map(order => ({
      ...order,
      items: (order.items || []).map(item => ({
        ...item,
        images: Array.isArray(item.images) ? item.images : [],
      })),
    }));

    localStorage.setItem("ordersUser", JSON.stringify(orders));
    dispatch(setOrder(orders));
    return orders;
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    dispatch(setOrder([]));
    throw error;
  }
};

export const fetchUserOrdersById = () => async (dispatch, getState) => {
  try {
    const { auth } = getState();
    const userId = auth.user?.id;
    const token = auth.user?.token;

    if (!userId) {
      console.error("❌ Usuario no autenticado");
      dispatch(setOrder([]));
      return [];
    }

    if (!token) {
      console.error("❌ No hay token de autenticación");
      dispatch(setOrder([]));
      return [];
    }

    const { data } = await axios.get(
      `${import.meta.env.VITE_APP_API_GETUSER_ORDERS_BY_ID_URL}`,
      {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          "x-token": token, // 🔥 IMPORTANTE (no Authorization)
        },
      }
    );

    if (!data.orders || data.orders.length === 0) {
      console.log("⚠️ No hay órdenes para este usuario");
      dispatch(setOrder([]));
      localStorage.removeItem("ordersUser");
      localStorage.removeItem("ordersUser_last_update");
      return [];
    }

    const filteredOrders = data.orders.filter(
      (order) =>
        order.user?.id === userId || order.user_id === userId
    );

    // ✅ 🔥 AQUÍ ESTÁ LA CLAVE
    const orders = filteredOrders.map((order) => ({
      id: order.id,
      total: Number(order.total) || 0,
      status: order.status,
      created_at: order.created_at,
      proof_img: order.proof_img || null,

      // 🔥 NECESARIO PARA TU UI
      proof_status: order.proof_status || null,

      user: order.user || {
        id: userId,
        name: auth.user?.name || "Usuario",
        lastname: auth.user?.lastname || "",
        email: auth.user?.email || "",
      },

      items: (order.items || []).map((item) => ({
        product_id: item.product_id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        images: Array.isArray(item.images)
          ? item.images
          : item.product_img_url
          ? [item.product_img_url]
          : [],
        subtotal:
          (Number(item.price) || 0) *
          (Number(item.quantity) || 1),
      })),
    }));

    localStorage.setItem("ordersUser", JSON.stringify(orders));
    localStorage.setItem(
      "ordersUser_last_update",
      new Date().getTime()
    );

    dispatch(setOrder(orders));

    return orders;
  } catch (error) {
    console.error("❌ Error al obtener las órdenes:", error);
    dispatch(setOrder([]));
    return [];
  }
};

