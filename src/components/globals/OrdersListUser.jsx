/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { formatPrice, getFile } from "../../../globalActions";
import { DropZoneCloudinary, BaseButton, Empty } from "../../../index";
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
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
      });
      return;
    }

    try {
      await onSendProof(orderId, image);

      Swal.fire({
        icon: "success",
        title: "Comprobante enviado",
        text: "Tu pago será validado pronto",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
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
          customClass: {
            popup: "custom-popup",
            title: "custom-title",
            content: "custom-content",
            htmlContainer: "swal-text",
            confirmButton: "swal-confirm-btn",
          },
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
        <div>
          <Empty img="box-empty" message={emptyMessage}/>
        </div>
      ) : (
        <div className="orders">
          <div className="orders-pending-list">
            {filteredOrders.map((order) => {

              const image = imagesByOrder[order.id];
              const canSend = Boolean(image?.url);
              // 🔥 CONDICIÓN CORREGIDA: Verificar si ya se envió un comprobante
              const hasProof = order.proof_img && order.proof_status !== 'unprooff';

              /* ================= APPROVED ================= */
              if (order.status === "shipped") {
                return (
                  <div key={order.id} className="orders-card horizontal">
                    <div className="orders-card-user">
                      {renderProductImages(order)}
                      
                        <div>
                          <p><strong>Número de pedido:</strong> {order.id}</p>
                          <p><strong>Usuario ID:</strong> {order.user.id || order.user?.id}</p>
                          <p>
                            <strong>Nombre:</strong>{" "}
                            {order.name || order.user?.name}{" "}
                            {order.lastname || order.user?.lastname}
                          </p>
                        </div>

                        <div>
                          <p><strong>Email:</strong> {order.email || order.user?.email}</p>
                          <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                          <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
                          <p><strong>Estado:</strong> {order.status === "shipped" ? "Pedido enviado" : "" }</p>
                        </div>
                    


                      <div className="orders-card-actions">
                        <span className="sent-success"> Pedido enviado </span>
                      </div>
                    </div>
                  </div>
                );
              }

              /* ================= PENDING SEND ================= */
              if (order.status === "pending shipment") {
                return (
                  <div key={order.id} className="order-card">
                    <div className="orders-card-user">
                      {renderProductImages(order)}
                      <div>
                        <strong>Pedido #{order.id}</strong>
                        <p>
                          <strong>Nombre:</strong>{" "}
                          {order.name || order.user?.name}{" "}
                          {order.lastname || order.user?.lastname}
                        </p>
                        <p><strong>Email:</strong> {order.email || order.user?.email}</p>
                      </div>

                        <div>
                          <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                          <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
                          <p><strong>Estado:</strong> {order.status === "pending shipment" ? "Pendiente de envío" : ""}</p>
                        </div>


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
                      {renderProductImages(order)}
                    <div>
                      <p><strong>Número de pedido:</strong> {order.id}</p>
                      <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                      <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
                      <p><strong>Estado: </strong>
                        {order.status === "pending shipment" ? 'Pendiente de envío' : ""
                        || order.status === "shipped" ? 'Pedido enviado' : ""
                        || order.status === "pending approval" ? 'Pago en revisión, por favor enviar comprobante' : ""
                        }
                      </p>
                    </div>

                  <div className="orders-card-capturepayment">

                    {/* 🔥 SI YA SE ENVIÓ EL COMPROBANTE */}
                    {hasProof ? (
                      <div style={{ marginTop: "10px" }}>
                        <p style={{ color: "green", fontWeight: "bold" }}>
                          ✅ Comprobante enviado
                        </p>
                        {order.proof_status && (
                          <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                            Estado: {order.proof_status === 'received' ? 'Recibido' : 'Pendiente de validación'}
                          </p>
                        )}
                        {order.proof_img && (
                          <img
                            src={order.proof_img}
                            alt="Comprobante"
                            style={{
                              width: "150px",
                              marginTop: "10px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              cursor: "pointer"
                            }}
                            onClick={() => {
                              Swal.fire({
                                imageUrl: order.proof_img,
                                imageAlt: "Comprobante de pago",
                                imageWidth: 600,
                                showCloseButton: true,
                                showConfirmButton: false,
                              });
                            }}
                          />
                        )}
                        <BaseButton
                          textLabel
                          label={order.proof_status === 'received' ? "Comprobante recibido" : "Comprobante enviado"}
                          disabled
                          classs="button primary"
                          $colorbtn="var(--gray)"
                          $colortextbtnprimary="white"
                        />
                      </div>
                    ) : (
                      <>
                      <strong>Carga tu comprobante de pago aquí</strong>
                        {/* 🔥 SUBIR IMAGEN SOLO SI NO SE HA ENVIADO */}
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
                      </>
                    )}

                  </div>
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