/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { formatPrice } from "../../../globalActions";
import { BaseButton } from "../../../index";

export const OrdersList = ({
  title = "Pedidos",
  orders = [],
  labelBtn,
  statusFilter = null, // ej: "pending aproval"
  approveUrl = null,
  onAfterAction = () => {},
  enableStream = false,
  confirmTextBtn,
  cancelTextBtn,
  streamUrl = null,
  showApproveButton = true,
  showRejectButton = false,
}) => {
  const [loading, setLoading] = useState(true);

  // 🔎 Filtrar por estado si se define
  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const handleApprove = async (orderId) => {
    if (!approveUrl) return;

    const result = await Swal.fire({
      title: "¿Aprobar pedido?",
      text: "Esta acción descontará stock y finalizará la orden",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `${confirmTextBtn}`,
      cancelButtonText: `${cancelTextBtn}`,
                customClass: {
            icon: 'swal-',
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            content: 'swal-custom-content',
            confirmButton: 'swal-confirm-btn',
            cancelButton: 'swal-cancel-btn',
          },
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Procesando...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await axios.put(`${approveUrl}/${orderId}`);

      Swal.fire("Aprobado", "El pedido fue aprobado correctamente", "success");

      onAfterAction();
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.error || "No se pudo aprobar el pedido",
        "error"
      );
    }
  };

  // ⏳ Simular carga inicial
  useEffect(() => {
    setLoading(false);
  }, []);

  // 🔥 Stream opcional (SSE)
  useEffect(() => {
    if (!enableStream || !streamUrl) return;

    const eventSource = new EventSource(streamUrl);

    eventSource.addEventListener("order-proof", (event) => {
      const data = JSON.parse(event.data);

      Swal.fire({
        icon: "info",
        title: "Nuevo comprobante recibido",
        text: `Pedido #${data.orderId} envió comprobante`,
        timer: 3000,
        showConfirmButton: false,
      });

      onAfterAction();
    });

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [enableStream, streamUrl]);

  if (loading) {
    return (
      <section className="sections">
        <h2>{title}</h2>
        <p>Cargando...</p>
      </section>
    );
  }

  return (
    <>
    {<section className="sections">
      <h2>{title}</h2>
<div className="orders-pending-list">
    
          {filteredOrders.map((order) => {
      const isApproved = order.status === "approved";
    
      return (
        <div
          key={order.id}
          className={isApproved ? "orders-card-user" : "orders-card"}
        >
          {isApproved ? (
            /* ============================= */
            /* ======= VISTA APROBADA ====== */
            /* ============================= */
            <>
              <p><strong>Pedido #</strong>{order.id}</p>
              <p><strong>Usuario ID:</strong> {order.user_id}</p>
              <p><strong>Nombre:</strong> {order.name} {order.lastname}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Estado:</strong> {order.status}</p>
              <p><strong>Total:</strong> {formatPrice(order.total)}</p>
              <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
    
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
            </>
          ) : (
            /* ============================= */
            /* ======= VISTA NORMAL ======== */
            /* ============================= */
            <>
              <strong>Pedido #{order.id}</strong>
    
              <p><strong>Usuario ID:</strong> {order.user_id}</p>
              <p><strong>Nombre:</strong> {order.name} {order.lastname}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Total:</strong> {formatPrice(order.total)}</p>
              <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
              <p><strong>Estado:</strong> {order.status}</p>
    
              <strong>Comprobante:</strong>
    
              {order.img_url ? (
                <div className="orders-proof-image">
                  <img
                    src={order.img_url}
                    alt={`Comprobante pedido ${order.id}`}
                    style={{
                      width: "200px",
                      marginTop: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
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
                </div>
              ) : (
                <p style={{ marginTop: "5px", color: "#888" }}>
                  Sin comprobante aún
                </p>
              )}
    
              <div className="orders-card-actions">
                {showApproveButton && (
                  <BaseButton
                    textLabel
                    label={labelBtn}
                    icon="check"
                    classs="button primary"
                    $colorbtn="var(--bg-primary)"
                    $colortextbtnprimary="var(--light)"
                    $colorbtnhoverprimary="var(--bg-primary-tr)"
                    $colortextbtnhoverprimary="white"
                    handleClick={() => handleApprove(order.id)}
                  />
                )}
    
                {showRejectButton && (
                  <BaseButton
                    textLabel
                    label="Rechazar"
                    icon="x"
                    classs="button primary"
                    $colorbtn="var(--secondary)"
                    $colortextbtnprimary="var(--light)"
                    $colorbtnhoverprimary="var(--secondary-semi)"
                    $colortextbtnhoverprimary="white"
                  />
                )}
              </div>
            </>
          )}
        </div>
      );
    })}
</div>
    </section>}
    </>
  );
};