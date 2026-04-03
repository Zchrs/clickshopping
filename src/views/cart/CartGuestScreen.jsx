/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BaseButton,
  CardProductCart,
  Empty,
  BaseCheckbox,
} from "../../../index";
import styled from "styled-components";
import { formatPrice } from "../../../globalActions";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Constantes para localStorage
const CART_STORAGE_KEY = "cart";
const GUEST_USER_KEY = "guestUser";

export const CartGuestScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  console.log(cartItems)
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [lastCheckedIndex, setLastCheckedIndex] = useState(null);
  const [guestInfo, setGuestInfo] = useState(null);

  const navigate = useNavigate();
  const lang = useSelector((state) => state.langUI.lang);
  const { t, i18n } = useTranslation();

  // Obtener estado de autenticación del reducer
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);

  // Calcular totals basado en items seleccionados
  const selectedItems = cartItems.filter((item) =>
    selectedIds.includes(item.product_id || item.id),
  );

  const selectedSubtotal = selectedItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity || 1),
    0,
  );

  const selectedCount = selectedItems.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0,
  );

  const allSelected =
    cartItems.length > 0 && selectedIds.length === cartItems.length;

  // Cargar guestInfo al iniciar (solo si no hay usuario autenticado)
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const guestData = localStorage.getItem(GUEST_USER_KEY);
        if (guestData) {
          const parsed = JSON.parse(guestData);
          setGuestInfo(parsed);
        } else {
          setGuestInfo(null);
        }
      } catch (error) {
        console.error("Error loading guest info:", error);
        setGuestInfo(null);
      }
    } else {
      // Si hay usuario autenticado, redirigir al carrito de usuario
      navigate("/dashboard/my-cart");
    }
  }, [isAuthenticated, navigate]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        setLoading(true);

        const storedCart = localStorage.getItem(CART_STORAGE_KEY);

        if (!storedCart) {
          setCartItems([]);
          return;
        }

        const parsedCart = JSON.parse(storedCart);

        if (!Array.isArray(parsedCart)) {
          setCartItems([]);
          return;
        }

        // 🔹 FILTRAR SOLO PRODUCTOS DEL INVITADO ACTUAL
        const filteredCart = guestInfo?.id
          ? parsedCart.filter((item) => item.guest_id === guestInfo.id)
          : [];

        setCartItems(filteredCart);
      } catch (error) {
        console.error("Error loading cart:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (guestInfo) {
      loadCartFromStorage();
    }
  }, [guestInfo]);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [cartItems, loading]);

  const handleRemoveFromCart = async (productId, name) => {
    const result = await Swal.fire({
      title: "Vas a eliminar un producto",
      html: `¿Estás seguro que deseas eliminar <strong>${name}</strong> del carrito?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Volver",
      background: "#f0f0f0",
      customClass: {
        popup: "swal-custom-popup",
        title: "custom-title",
        content: "custom-content",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
    });

    if (result.isConfirmed) {
      const updatedCart = cartItems.filter(
        (item) => (item.product_id || item.id) !== productId,
      );

      setCartItems(updatedCart);
      // Remover de seleccionados si estaba seleccionado
      setSelectedIds((prev) => prev.filter((id) => id !== productId));

      Swal.fire({
        title: "¡Eliminado!",
        html: `<strong>${name}</strong> ha sido eliminado del carrito`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleMoveToWishlist = async (productId, name) => {
    try {
      const result = await Swal.fire({
        title: "Enviando a lista de deseos",
        html: `¿Estás seguro que deseas mover <strong>${name}</strong> a la lista de deseos?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Volver",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
          cancelButton: "swal-cancel-btn",
        },
      });

      if (result.isConfirmed) {
        const wishlistKey = guestInfo?.id
          ? `guest_wishlist_${guestInfo.id}`
          : "guest_wishlist";
        const currentWishlist = JSON.parse(
          localStorage.getItem(wishlistKey) || "[]",
        );

        const productToMove = cartItems.find(
          (item) => (item.product_id || item.id) === productId,
        );

        if (productToMove) {
          const existsInWishlist = currentWishlist.some(
            (item) => (item.product_id || item.id) === productId,
          );

          if (!existsInWishlist) {
            const updatedWishlist = [...currentWishlist, productToMove];
            localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
          }

          const updatedCart = cartItems.filter(
            (item) => (item.product_id || item.id) !== productId,
          );

          setCartItems(updatedCart);
          setSelectedIds((prev) => prev.filter((id) => id !== productId));
        }

        Swal.fire({
          title: "¡Hecho!",
          html: `<strong>${name}</strong> se ha enviado a la lista de deseos`,
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "Volver",
          background: "#f0f0f0",
          customClass: {
            popup: "swal-custom-popup",
            title: "custom-title",
            content: "custom-content",
            confirmButton: "swal-confirm-btn",
          },
        });
      }
    } catch (error) {
      console.error("Error moving product:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al intentar mover el producto.",
        icon: "error",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
        },
      });
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        title: "Selecciona productos",
        text: "Debes seleccionar al menos un producto para continuar",
        icon: "warning",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
        },
      });
      return;
    }

    if (!guestInfo?.id) {
      Swal.fire({
        title: "Error",
        text: "No se encontró información del invitado",
        icon: "error",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
        },
      });
      return;
    }
    const checkoutProducts = selectedItems.map((item) => ({
      product_id: item.product_id || item.id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity || 1),

      // ✅ NORMALIZADO
      img:
        item.img_urls?.[0] ||
        item.img_url?.[0] ||
        (Array.isArray(item.img) ? item.img[0] : item.img) ||
        item.image ||
        "",
    }));

    const checkoutData = {
      guest: true,
      guest_id: guestInfo.id,
      products: checkoutProducts,
      subtotal: Number(selectedSubtotal),
    };

    localStorage.setItem("checkout_data", JSON.stringify(checkoutData));

    Swal.fire({
      title: "Compra como invitado",
      text: "Estás comprando como usuario invitado.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "swal-custom-popup",
        title: "custom-title",
        content: "custom-content",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/cart-guest/checkout", {
          state: checkoutData,
        });
      }
    });
  };

  const formatGuestId = (id) => {
    if (!id) return "";
    if (id.length <= 10) return id;

    const firstPart = id.substring(0, 6);
    const lastPart = id.substring(id.length - 6);

    return `${firstPart}...${lastPart}`;
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedIds([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((item) => item.product_id || item.id));
    }
  };

  const toggleOne = (productId, index, checked, shiftKey) => {
    if (shiftKey && lastCheckedIndex !== null && index !== lastCheckedIndex) {
      const start = Math.min(lastCheckedIndex, index);
      const end = Math.max(lastCheckedIndex, index);
      const rangeIds = cartItems
        .slice(start, end + 1)
        .map((item) => item.product_id || item.id);

      setSelectedIds((prev) =>
        checked
          ? Array.from(new Set([...prev, ...rangeIds]))
          : prev.filter((id) => !rangeIds.includes(id)),
      );
    } else {
      setSelectedIds((prev) =>
        checked ? [...prev, productId] : prev.filter((id) => id !== productId),
      );
    }

    setLastCheckedIndex(index);
  };

  // Si hay usuario autenticado, no mostrar nada (redirige en useEffect)
  if (isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <MyCart>
        <div className="mycart">
          <div className="mycart-contain">
            <div className="mycart-contain-header">
              <h2>Mi carrito de invitado</h2>
            </div>
            <div className="mycart-contain-items">
              <div className="loading-spinner">
                <p>Cargando productos...</p>
              </div>
            </div>
          </div>
        </div>
      </MyCart>
    );
  }

  return (
    <MyCart>
      <div className="mycart">
        <div className="mycart-contain">
          <div className="mycart-contain-header">
            <div className="header-top">
              <h2>Mi carrito de invitado ({cartItems.length})</h2>
              {guestInfo && (
                <div className="guest-info">
                  <small className="guest-badge">Modo invitado</small>
                  <small className="guest-name">
                    <strong>Bienvenido</strong>, {formatGuestId(guestInfo.id)}
                  </small>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="select-all-container">
                <BaseCheckbox
                  id="select-all"
                  modelValue={allSelected}
                  valueChange={toggleSelectAll}
                />
                <span className="select-all-label">Seleccionar todos</span>
                <span className="selected-count">
                  ({selectedIds.length} de {cartItems.length} seleccionados)
                </span>
              </div>
            )}
          </div>

          <div className="mycart-contain-items">
            {!Array.isArray(cartItems) || cartItems.length === 0 ? (
              <Empty img="empty" message={t("globals.emptyProducts")} />
            ) : (
              cartItems.map((item, index) => {
                const productId = item.product_id || item.id;
                const isSelected = selectedIds.includes(productId);

                return (
                  <div
                    key={productId || `temp-${index}`}
                    className="mycart-contain-item">
                    <div>
                      <BaseCheckbox
                        id={`select-${productId}`}
                        modelValue={isSelected}
                        valueChange={(checked, e) =>
                          toggleOne(productId, index, checked, e?.shiftKey)
                        }
                      />
                        </div>
                    <CardProductCart
                      img={
                        item.img_urls && item.img_urls.length > 0
                        ? item.img_urls[0]
                          : Array.isArray(item.img) && item.img.length > 0
                          ? item.img[0]
                            : item.img || ""
                      }
                      price={`COP $${formatPrice(Number(item.price))}`}
                      color={item.color}
                      name={item.name}
                      quantity={Number(item.quantity || 1)}
                      onRemove={() =>
                        handleRemoveFromCart(productId, item.name)
                      }
                      onWishlist={() =>
                        handleMoveToWishlist(productId, item.name)
                      }
                      />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <section className="mycart-summary">
          <h3>Resumen</h3>
          <div className="mycart-flex">
            <p>Productos seleccionados:</p>
            <strong>{selectedCount}</strong>
          </div>
          <div className="mycart-flex">
            <p>Subtotal:</p>
            <strong>${formatPrice(selectedSubtotal)}</strong>
          </div>
          <div className="mycart-flex">
            <p>Envío:</p>
            <strong>$0</strong>
          </div>
          <div className="mycart-flex total">
            <p>Total a pagar:</p>
            <strong>${formatPrice(selectedSubtotal)}</strong>
          </div>

          <div className="guest-message">
            <p className="texts txsm">
              <span className="info-icon">ℹ️</span>
              Como invitado, tus productos se guardarán temporalmente en este
              dispositivo.
              <strong>
                {" "}
                Inicia sesión para guardar tu carrito permanentemente.
              </strong>
            </p>
          </div>

          <BaseButton
            textLabel={true}
            label={`Pagar (${selectedCount})`}
            icon={"pay"}
            classs={"button primary"}
            $colorbtn={"var(--bg-primary)"}
            $colortextbtnprimary={"var(--light)"}
            $colorbtnhoverprimary={"var(--bg-primary-tr)"}
            $colortextbtnhoverprimary={"white"}
            handleClick={handleCheckout}
            disabled={selectedItems.length === 0}
          />

          <div>
            <h5>Entrega Rápida</h5>
            <p className="texts txsm">
              Cupón de descuento de COP $50.000 por entrega tardía, nos tomamos
              muy en serio las entregas a tiempo.
            </p>
          </div>
          <div>
            <h5>Seguridad y privacidad</h5>
            <p className="texts txsm">
              Pagos seguros - Datos personales seguros
            </p>
          </div>
        </section>
      </div>
    </MyCart>
  );
};

const MyCart = styled.div`
  display: grid;
  padding: 25px;
  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    color: #666;
  }

  .mycart {
    display: grid;
    grid-template-columns: 70% 1fr;
    width: 100%;
    align-items: start;
    height: fit-content;
    gap: 15px;

    @media (max-width: 720px) {
      grid-template-columns: 1fr;
    }

    &-summary {
      display: grid;
      align-items: start;
      height: fit-content;
      gap: 15px;
      background: white;
      box-shadow:
        1px 1px 3px #ebe9e9,
        -1px -1px 3px #ebe9e9;
      border-radius: 0px 10px 10px 0px;
      padding: 15px;

      .total {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 2px solid #eee;
        font-size: 18px;

        strong {
          color: var(--primary);
        }
      }
    }

    &-contain {
      align-items: start;
      display: grid;
      height: fit-content;
      gap: 15px;

      &-header {
        display: grid;
        background: white;
        border-radius: 10px 10px 0 0;
        box-shadow:
          1px 1px 3px #ebe9e9,
          -1px -1px 3px #ebe9e9;
        width: 100%;
        height: fit-content;
        padding: 15px;
        gap: 10px;

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;

          h2 {
            margin: 0;
            font-size: 20px;
          }

          .guest-info {
            display: flex;
            align-items: center;
            gap: 10px;

            .guest-badge {
              background: #ff9800;
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }

            .guest-name {
              color: #666;
              font-size: 14px;
            }
          }
        }

        .select-all-container {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0 5px;
          border-bottom: 1px solid #eee;

          .select-all-label {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            cursor: pointer;
          }

          .selected-count {
            font-size: 12px;
            color: #666;
            margin-left: auto;
          }
        }
      }

      &-item {
        display: flex;
        align-content: start;
        gap: 5px;
      }
    }

    &-flex {
      display: flex;
      justify-content: space-between;
    }
  }

  .guest-message {
    background: #fff3e0;
    border-left: 4px solid #ff9800;
    padding: 10px;
    border-radius: 4px;
    margin: 10px 0;

    .texts {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;

      .info-icon {
        font-size: 18px;
      }

      strong {
        color: #ff9800;
        display: block;
        margin-top: 5px;
      }
    }
  }
`;
