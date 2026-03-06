/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { formatPrice, getFile } from "../../../globalActions";
import { DropZoneCloudinary, BaseButton } from "../../../index";
import styled from "styled-components";

export const OrdersListUser = ({
  title = "Pedidos",
  note,
  orders = [],
  statusFilter,
  emptyMessage = "No hay pedidos",
  onSendProof,
}) => {

  const [imagesByOrder, setImagesByOrder] = useState({});

  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const handleImageUploaded = (orderId, imageData) => {
    setImagesByOrder((prev) => ({
      ...prev,
      [orderId]: imageData,
    }));
  };

  const handleSend = async (orderId) => {
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
      await onSendProof(orderId, image);

      Swal.fire({
        icon: "success",
        title: "Comprobante enviado",
        text: "Tu pago será validado pronto",
      });

      setImagesByOrder((prev) => {
        const copy = { ...prev };
        delete copy[orderId];
        return copy;
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el comprobante",
      });
    }
  };

  /* ============================= */
  /* 🔥 IMÁGENES DE PRODUCTOS     */
  /* ============================= */
  const renderProductImages = (order) => {
    if (!order.items || !order.items.length) return null;

    return (
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
          flexWrap: "wrap",
        }}
      >
        {order.items.map((item, index) => {
          const productImage =
            item.product?.images?.[0] ||
            item.images?.[0] ||
            item.product?.image ||
            item.image;

          if (!productImage) return null;

          return (
            <img
              key={index}
              src={productImage}
              alt={item.name || "Producto"}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <section className="sections">
      <h2>{title}</h2>
      <p>{note}</p>

      {!filteredOrders.length ? (
        <p>{emptyMessage}</p>
      ) : (
        <div className="orders">
          <div className="orders-pending-list">
            {filteredOrders.map((order) => {

              const image = imagesByOrder[order.id];
              const canSend = Boolean(image?.url);

              /* ================= APPROVED ================= */
              if (order.status === "approved") {
                return (
                  <div key={order.id} className="orders-card">
                    <div className="orders-card-user">
                      <p><strong>Pedido #</strong> {order.id}</p>
                      <p><strong>Usuario ID:</strong> {order.user.id || order.user?.id}</p>
                      <p>
                        <strong>Nombre:</strong>{" "}
                        {order.name || order.user?.name}{" "}
                        {order.lastname || order.user?.lastname}
                      </p>
                      <p><strong>Email:</strong> {order.email || order.user?.email}</p>
                      <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                      <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
                      <p><strong>Estado:</strong> {order.status}</p>

                      {renderProductImages(order)}

                      <div className="orders-card-actions">
                        <BaseButton
                          textLabel
                          label="Aprobada"
                          icon="success"
                          img
                          classs="button primary"
                          $colorbtn="var(--success)"
                          $colortextbtnprimary="var(--light)"
                          $colorbtnhoverprimary="var(--success)"
                          $colortextbtnhoverprimary="white"
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              /* ================= PENDING SEND ================= */
              if (order.status === "pending send") {
                return (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <strong>Pedido #{order.id}</strong>
                      <span className="badge pending">Pendiente</span>
                    </div>

                    <div className="orders-card-user">
                      <p>
                        <strong>Nombre:</strong>{" "}
                        {order.name || order.user?.name}{" "}
                        {order.lastname || order.user?.lastname}
                      </p>
                      <p><strong>Email:</strong> {order.email || order.user?.email}</p>
                      <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                      <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
                      <p><strong>Estado:</strong> {order.status}</p>

                      {renderProductImages(order)}

                      <LinK>
                        <a
                          href={`https://wa.me/573173595203?text=${encodeURIComponent(
                            `Hola, soy ${order.name || order.user?.name} ${
                              order.lastname || order.user?.lastname
                            } tengo un pedido pendiente (#${order.id}) y necesito ayuda.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={getFile("svg", "whatsapp-logo", "svg")}
                            alt="WhatsApp"
                          />
                          ¿24 horas y aún pendiente? Escríbenos ahora y juntos lo resolveremos.
                        </a>
                      </LinK>
                    </div>
                  </div>
                );
              }

              /* ================= RESTO ================= */
              return (
                <div key={order.id} className="orders-card">
                  <div className="orders-card-user">
                    <p><strong>Pedido #</strong> {order.id}</p>
                    <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                    <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <p><strong>Estado:</strong> {order.status}</p>

                    {renderProductImages(order)}
                  </div>

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
                      textLabel
                      label="Enviar comprobante"
                      handleClick={() => handleSend(order.id)}
                      disabled={!canSend}
                      classs="button primary"
                      $colorbtn="var(--primary)"
                      $colortextbtnprimary="var(--light)"
                      $colorbtnhoverprimary="var(--primary-semi)"
                      $colortextbtnhoverprimary="white"
                    />
                  </div>
                </div>
              );

            })}
          </div>
        </div>
      )}
    </section>
  );
};

const LinK = styled.div`
  a{
    display: flex;
    color: var(--dark);
    align-items: center;
    width: 100%;
    gap: 5px;
    &:hover{
      color: var(--primary);
    }
  }
  img{
    width: 40px;
  }
`;