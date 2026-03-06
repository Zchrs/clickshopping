/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartGuest, removeFromCartGuest, moveFromCartToWishlistGuest } from "../../actions/cartActions";
import { BaseButton, CardProductCart, Empty } from "../../../index";
import styled from "styled-components";
import { formatPrice } from "../../../globalActions";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export const CartGuestScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const guestId = localStorage.getItem("guest_id"); // Obtener guestId del localStorage
  const lang = useSelector((state) => state.langUI.lang);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const getCartItems = async () => {
      try {
        if (guestId && typeof guestId === "string" && guestId.trim() !== "") {
          const items = await fetchCartGuest(guestId);
          setCartItems(items);
          calculateTotals(items);
        } else {
          console.error("Guest ID is invalid or missing");
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    getCartItems();
  }, [guestId]);

  const handleRemoveFromCart = async (productId, name) => {
    const result = await Swal.fire({
      title: 'Vas a eliminar un producto',
      html: `¡Estás seguro que deseas eliminar <strong>${name}</strong> del carrito?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Volver',
      background: '#f0f0f0',
      customClass: {
        popup: 'custom-popup',
        title: 'custom-title',
        content: 'custom-content',
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
      },
    });

    if (result.isConfirmed) {
      await removeFromCartGuest(productId, guestId);
      // Después de eliminar el producto del carrito, recargar los elementos del carrito
      const items = await fetchCartGuest(guestId);
      setCartItems(items);
      calculateTotals(items);
      
      Swal.fire({
        title: '¡Eliminado!',
        html: `<strong>${name}</strong> ha sido eliminado del carrito`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleMoveToWishlist = async (productId, name) => {
    try {
      const result = await Swal.fire({
        title: 'Enviando a lista de deseos',
        html: `¿Estás seguro que deseas mover <strong>${name}</strong> a la lista de deseos?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Volver',
        background: '#f0f0f0',
        customClass: {
          popup: 'custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'custom-confirm-button',
          cancelButton: 'custom-cancel-button',
        },
      });

      if (result.isConfirmed) {
        await moveFromCartToWishlistGuest(productId, guestId);

        Swal.fire({
          title: '¡Hecho!',
          html: `¡<strong>${name}</strong> se ha enviado a la lista de deseos!`,
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Volver',
          background: '#f0f0f0',
          customClass: {
            popup: 'custom-popup',
            title: 'custom-title',
            content: 'custom-content',
            confirmButton: 'custom-confirm-button',
          },
        });

        // Después de mover el producto al wishlist, recargar los elementos del carrito
        const items = await fetchCartGuest(guestId);
        setCartItems(items);
        calculateTotals(items);
      }
    } catch (error) {
      console.error('Error moving product:', error.response?.data || error.message);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al intentar mover el producto.',
        icon: 'error',
        background: '#f0f0f0',
        customClass: {
          popup: 'custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'custom-confirm-button',
        },
      });
    }
  };

  const calculateTotals = (items) => {
    const subtotalValue = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    setSubtotal(subtotalValue);
    setTotal(totalItemsCount);
  };

  const handleCheckout = () => {
    // Redirigir al checkout o mostrar modal de registro/login
    Swal.fire({
      title: '¿Quieres continuar?',
      html: 'Para finalizar tu compra, necesitas <strong>iniciar sesión</strong> o <strong>registrarte</strong>',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Iniciar sesión',
      cancelButtonText: 'Seguir como invitado',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      } else {
        window.location.href = "/checkout-guest";
      }
    });
  };

  if (loading) {
    return (
      <MyCart>
        <div className="mycart">
          <div className="mycart-contain">
            <div className="mycart-contain-header">
              <h2>Mi carrito de invitado</h2>
            </div>
            <div className="mycart-contain-items">
              <p>Cargando productos...</p>
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
            <h2>Mi carrito de invitado ({total})</h2>
            <small className="guest-badge">Modo invitado</small>
          </div>
          <div className="mycart-contain-items">
            {loading ? (
              <p>Cargando productos...</p>
            ) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
              <Empty img="empty" message={t("globals.emptyProducts")} />
            ) : (
              cartItems.map((item) => (
                <CardProductCart
                  key={item.id}
                  img={
                    item.img_urls && item.img_urls.length > 0
                      ? item.img_urls[0]
                      : ""
                  }
                  price={`COP $${formatPrice(item.price)}`}
                  name={item.name}
                  quantity={item.quantity}
                  onRemove={() => handleRemoveFromCart(item.product_id, item.name)}
                  onWishlist={() => handleMoveToWishlist(item.product_id, item.name)}
                />
              ))
            )}
          </div>
        </div>
        <section className="mycart-summary">
          <h3>Resumen</h3>
          <div className="mycart-flex">
            <p>Subtotal:</p>
            <strong>${formatPrice(subtotal)}</strong>
          </div>
          <div className="mycart-flex">
            <p>Envío:</p>
            <strong>${formatPrice(0)}</strong>
          </div>
          <div className="mycart-flex">
            <p>Total:</p> 
            <strong>${formatPrice(subtotal)}</strong>
          </div>
          
          <div className="guest-message">
            <p className="texts txsm">
              <span className="info-icon">ℹ️</span> 
              Como invitado, tus productos se guardarán temporalmente. 
              <strong> Inicia sesión para guardar tu carrito permanentemente.</strong>
            </p>
          </div>

          <BaseButton
            textLabel={true}
            label={`Pagar (${total})`}
            icon={"pay"}
            classs={'button primary'} 
            colorbtn={"var(--bg-primary)"}
            colortextbtnprimary={"var(--light)"}
            colorbtnhoverprimary={"var(--bg-primary-tr)"}
            colortextbtnhoverprimary={"white"}  
            onClick={handleCheckout}
          />
          
          <div>
            <h5>Entrega Rápida</h5>
            <p className="texts txsm">
              Cupón de descuento de COP $50.000 por entrega tardía,
              nos tomamos muy en serio las entregas a tiempo.
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
      box-shadow: 1px 1px 3px #ebe9e9, -1px -1px 3px #ebe9e9;
      border-radius: 0px 10px 10px 0px;
      padding: 15px;
    }

    &-contain {
      align-items: start;
      display: grid;
      height: fit-content;
      gap: 15px;

      &-header {
        display: grid;
        background: white;
        border-radius: 0px;
        box-shadow: 1px 1px 3px #ebe9e9, -1px -1px 3px #ebe9e9;
        width: 100%;
        height: fit-content;
        padding: 15px;
        position: relative;
        
        .guest-badge {
          background: #ff9800;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          width: fit-content;
          margin-top: 5px;
        }
      }

      &-items {
        display: grid;
        gap: 15px;
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