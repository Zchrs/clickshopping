/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { formatPrice } from "../../../globalActions";
import { BaseButton, BaseInput, Empty, Pagination } from "../../../index";

export const OrdersList = ({
  title = "Pedidos",
  orders = [],
  labelBtn,
  statusFilter = null,
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
  
  // 🔥 Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Mostrar 20 items por página

  // 🔎 Filtrar por estado si se define
  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  // 🔥 Calcular paginación
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // 🔥 Obtener órdenes de la página actual
  const currentOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // 🔥 Resetear a página 1 cuando cambian las órdenes o el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOrders.length, statusFilter]);

  const handleApprove = async (orderId) => {
    if (!approveUrl) return;

    const tokenAdmin = localStorage.getItem("tokenAdmin");

    if (!tokenAdmin) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes permisos de administrador",
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

    const result = await Swal.fire({
      title: "¿Aprobar pedido?",
      text: "Esta acción descontará stock y finalizará la orden",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmTextBtn,
      cancelButtonText: cancelTextBtn,
      customClass: {
        popup: "custom-popup",
        title: "custom-title",
        content: "custom-content",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Procesando...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const encodedOrderId = encodeURIComponent(orderId);

      await axios.put(
        `${approveUrl}/${encodedOrderId}`,
        {},
        {
          headers: {
            "x-token": tokenAdmin,
          },
        }
      );

      Swal.fire({
        title: "Aprobado", 
        text: "El pedido fue aprobado correctamente", 
        icon: "success",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
      });

      onAfterAction();

    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || "No se pudo aprobar el pedido",
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

  // Calcular rango de items mostrados
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <section className="sections">
      <div className="orders-header">
        <h2>{title} {totalItems > 0 && `(${totalItems})`}</h2>
        {totalItems > 0 && (
          <div className="orders-range">
            Mostrando {startItem} - {endItem} de {totalItems} pedidos
          </div>
        )}
      </div>
      
      <div className="orders-pending-list">
        {!filteredOrders.length ? (
          <div className="orders-empty">
            <Empty img="box-empty" message="Sin pedidos pendientes de aprobación"/>
          </div>
        ) : (
          currentOrders.map((order) => {
            const isApproved = order.status === "shipped";
            
            // Obtener datos del usuario de manera consistente
            const userData = order.user || {
              id: order.guest_id || order.user_id || '',
              name: order.name || "Invitado",
              lastname: order.lastname || "",
              email: order.email || ""
            };

            // 🔥 Obtener datos del comprobante
            const proof = order.payment_proof;
            const hasProof = proof && proof.img_url && proof.status !== 'unprooff';

            // 🔥 Función para mostrar el estado en español
            const getStatusText = (status) => {
              switch(status) {
                case "pending shipment":
                  return "Pendiente de envío";
                case "shipped":
                  return "Pedido enviado";
                case "pending approval":
                  return "Pago en revisión";
                case "pending send":
                  return "Pendiente de envío";
                case "paid":
                  return "Pagado";
                case "cancelled":
                  return "Cancelado";
                default:
                  return status;
              }
            };

            return (
              <div
                key={order.id}
                className={isApproved ? "orders-card" : "orders-card"}
              >
                <div className="orders-card-flex">
                  <div>
                    <strong>Pedido #{order.id}</strong>
                    {/* Información del usuario */}
                    <p>
                      <strong>Usuario ID:</strong> {userData.id}
                    </p>
                    <p>
                      <strong>Nombre:</strong> {userData.name} {userData.lastname}
                    </p>
                    <p>
                      <strong>Email:</strong> {userData.email}
                    </p>
                  </div>
                  
                  <div>
                    {/* Información de la orden */}
                    <p>
                      <strong>Total:</strong> {formatPrice(order.total || 0)}
                    </p>
                    <p>
                      <strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}
                    </p>
                    <p>
                      <strong>Estado:</strong> {getStatusText(order.status)}
                    </p>
                  </div>
                {/* 🔥 COMPROBANTE - MEJORADO */}
                {hasProof ? (
                  <>
                    <div className="orders-proof-image">
                      <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
                        {proof.status === 'received' ? 'Comprobante recibido ✅' : 'Pendiente de validación ⏳'}
                      </p>
                      <img
                        src={proof.img_url}
                        alt={`Comprobante pedido ${order.id}`}
                        style={{
                          width: "200px",
                          marginTop: "10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          border: "1px solid #ddd"
                        }}
                        onClick={() =>
                          Swal.fire({
                            imageUrl: proof.img_url,
                            imageAlt: "Comprobante de pago",
                            title: `Comprobante - Pedido #${order.id}`,
                            imageWidth: 600,
                            showCloseButton: true,
                            showConfirmButton: false,
                            customClass: {
                              popup: "custom-popup",
                            },
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <p style={{ marginTop: "5px", color: "#888" }}>
                    Sin comprobante aún
                  </p>
                )}
                {/* Botones de acción */}
                <div className="orders-card-actions">


                  {isApproved && (
                    <div className="orders-card-actions">
                      <span className="sent-success"> Pedido enviado </span>
                    </div>
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
                </div>

                {order.status === "pending shipment" ? 
                  <div>
                    <div>
                      <strong>
                        Detalles de envío
                      </strong>
                      <br />
                      <p>Datos del repartidor</p>
                    </div>
                      <div className="orders-card-flex">
                        <BaseInput
                          id="name"
                          name="name"
                          placeholder="Nombre"
                          classs={"inputs normal"}
                          label="Nombre"  
                          // inputRef={formRefs.name}
                          // value={form.name}
                          // onBlur={handleBlur}
                          // onChange={handleChange}
                          required
                        />
                        <BaseInput
                          id="name"
                          name="name"
                          placeholder="Apellido"
                          classs={"inputs normal"}
                          
                          // inputRef={formRefs.name}
                          // value={form.name}
                          // onBlur={handleBlur}
                          // onChange={handleChange}
                          required
                          label="Apellido"  
                        />
                        <BaseInput
                          id="docId"
                          name="docId"
                          placeholder="Número de cédula"
                          classs={"inputs normal"}
                          
                          // inputRef={formRefs.docId}
                          // value={form.docId}
                          // onBlur={handleBlur}
                          // onChange={handleChange}
                          required
                          label="Número de cédula"  
                        />
                        <BaseInput
                          id="name"
                          name="name"
                          placeholder="Nombre del producto"
                          classs={"inputs normal"}
                          label="Placa del vehículo"  
                          // inputRef={formRefs.name}
                          // value={form.name}
                          // onBlur={handleBlur}
                          // onChange={handleChange}
                          required
                        />
                        <BaseInput
                          id="name"
                          name="name"
                          placeholder="Tipo de vehículo"
                          classs={"inputs normal"}
                          label="Tipo de vehículo"  
                          // inputRef={formRefs.name}
                          // value={form.name}
                          // onBlur={handleBlur}
                          // onChange={handleChange}
                          required
                        />
                      </div>
                      
                  </div> : ""
                  }
                  {!isApproved && showApproveButton && hasProof && (
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
              </div>
            );
          })
        )}
      </div>
      
      {/* 🔥 Paginación - Solo mostrar si hay más de una página */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            colorText="dark"
            arrowPrev="button dark"
            arrowNext="button dark"
            />
        </div>
      )}
   
    </section>
  );
};