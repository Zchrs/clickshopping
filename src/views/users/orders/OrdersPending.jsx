/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { formatPrice } from "../../../../globalActions";
import { fetchUserOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { DropZoneCloudinary } from "../../../components/globals/DropZoneCloudinary";
import { BaseButton } from "../../../components/globals/BaseButton";

export const OrdersPending = () => {
  const allOrders = useSelector((state) => state.order.orderInfo || []);
  const user = useSelector((state) => state.auth.user);
  const [imagesByOrder, setImagesByOrder] = useState({});
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  // 🔥 SOLO pedidos pendientes reales
  const pendingOrders = allOrders.filter(
    (o) => o.status === "pending aproval"
  );

  useEffect(() => {
    dispatch(fetchUserOrders()).finally(() => setLoading(false));
  }, []);

  

  const handleImageUploaded = (orderId, imageData) => {
    setImagesByOrder((prev) => ({
      ...prev,
      [orderId]: imageData,
    }));
  };

  const handleSendProof = async (orderId) => {
    const image = imagesByOrder[orderId];

    if (!image?.url) {
      Swal.fire({
        icon: "warning",
        title: "Falta comprobante",
        text: "Debes subir una imagen antes de enviarla",
      });
      return;
    }

    try {
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

      Swal.fire({
        icon: "success",
        title: "Comprobante enviado",
        text: "Tu pago será validado pronto",
      });

      // 🔥 Refrescar órdenes desde backend
      dispatch(fetchUserOrders());

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el comprobante",
      });
    }
  };

  if (loading) {
    return (
      <section className="sections">
        <h2>Pedidos pendientes</h2>
        <p>Cargando...</p>
      </section>
    );
  }

  return (
    <section className="sections">
      <h2>Pendientes de pago</h2>

      {!pendingOrders.length ? (
        <p>No hay pedidos pendientes</p>
      ) : (
        <div className="orders">
          <div className="orders-pending-list">
            {pendingOrders.map((order) => {
              const image = imagesByOrder[order.id];
              const canSend = Boolean(image?.url);

              return (
                <div key={order.id} className="orders-card">

                  {/* INFO ORDEN */}
                  <div className="orders-card-user">
                    <p><strong>Pedido #</strong> {order.id}</p>
                    <p>
                      <strong>Nombre:</strong>{" "}
                      {order.name || order.user?.name}{" "}
                      {order.lastname || order.user?.lastname}
                    </p>
                    <p><strong>Email:</strong> {order.email || order.user?.email}</p>
                    <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                    <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <p><strong>Estado:</strong> {order.status}</p>
                  </div>

                  {/* PRODUCTOS */}
                  <div className="orders-card-products">
                    <h4>Productos</h4>

                    <div className="orders-products-grid">
                      {order.items?.map((item) => (
                        <div
                          key={item.id || item.product_id}
                          className="orders-products-item"
                        >
                          <img src={item.images?.[0]} alt={item.name} />
                          <div className="product-info">
                            <p className="product-name">{item.name}</p>
                            <p>Cantidad: {item.quantity}</p>
                            <p>{formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 🔥 SOLO MOSTRAR SI ESTÁ PENDIENTE */}
                  {order.img_url ? (

  // 🔥 SI EXISTE COMPROBANTE → MOSTRAR IMAGEN
  <div className="orders-proof-preview">
    <h4>Comprobante enviado</h4>

    <img
      src={order.img_url}
      alt={`Comprobante ${order.id}`}
      style={{
        width: "200px",
        marginTop: "10px",
        borderRadius: "8px",
        cursor: "pointer"
      }}
      onClick={() =>
        Swal.fire({
          imageUrl: order.img_url,
          imageAlt: "Comprobante",
          showConfirmButton: false,
          showCloseButton: true,
        })
      }
    />

    <p style={{ marginTop: "10px", color: "#888" }}>
      En espera de validación
    </p>
  </div>

) : (

  // 🔥 SI NO EXISTE → MOSTRAR DROPZONE
  <div className="orders-card-capturepayment">
    <DropZoneCloudinary
      id={`proof_${order.id}`}
      name={`proof_${order.id}`}
      setImage={(img) =>
        handleImageUploaded(order.id, img)
      }
      paymentProof
    />

    <BaseButton
      type="button"
      textLabel={true}
      label="Enviar comprobante"
      handleClick={() =>
        handleSendProof(order.id)
      }
      disabled={!canSend}
      classs={"button primary"}
      $colorbtn={"var(--primary)"}
      $colortextbtnprimary={"var(--light)"}
      $colorbtnhoverprimary={"var(--primary-semi)"}
      $colortextbtnhoverprimary={"white"}
    />
  </div>

)}

                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};