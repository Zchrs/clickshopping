/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BaseButton, CardProductCart, Empty } from "../../../index";
import styled from "styled-components";
import { formatPrice } from "../../../globalActions";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { cartService } from "../../services/cartService";

export const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Usar currentUser del reducer que tiene toda la info
  const { currentUser, isAuthenticated, isGuest } = useSelector((state) => state.auth);
  
  console.log("Estado de auth:", { currentUser, isAuthenticated, isGuest });
  console.log("ID del usuario:", currentUser?.id);

  const lang = useSelector((state) => state.langUI.lang);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  // Cargar items del carrito
  useEffect(() => {
    const loadCartItems = async () => {
      setLoading(true);
      
      try {
        // Solo cargar si es usuario autenticado (no invitado)
        if (!isAuthenticated || !currentUser?.id) {
          console.log("No hay usuario autenticado o es invitado");
          setCartItems([]);
          calculateTotals([]);
          return;
        }

        console.log("Cargando carrito para usuario:", currentUser.id);
        
        // Llamar a la API
        const items = await cartService.getCart(currentUser.id);
        console.log("Items del carrito:", items);
        
        setCartItems(items);
        calculateTotals(items);
        
      } catch (error) {
        console.error("Error loading cart items:", error);
        Swal.fire({
          title: "Error",
          text: error.message || "No se pudo cargar el carrito",
          icon: "error",
          customClass: {
            popup: "swal-custom-popup",
            title: "custom-title",
            content: "custom-content",
            confirmButton: "swal-confirm-btn",
          },
        });
        setCartItems([]);
        calculateTotals([]);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, [isAuthenticated, currentUser?.id]); // Dependencias correctas

  const handleRemoveFromCart = async (cartItemId, name) => {
    const result = await Swal.fire({
      title: 'Vas a eliminar un producto',
      html: `¿Estás seguro que deseas eliminar <strong>${name}</strong> del carrito?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Volver',
      background: '#f0f0f0',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'custom-title',
        content: 'custom-content',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
    });

    if (result.isConfirmed) {
      try {
        await cartService.removeFromCart(cartItemId);
        
        // Recargar carrito
        const items = await cartService.getCart(currentUser.id);
        setCartItems(items);
        calculateTotals(items);
        
        Swal.fire({
          title: '¡Eliminado!',
          text: `${name} ha sido eliminado del carrito`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudo eliminar el producto',
          icon: 'error',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'custom-title',
            content: 'custom-content',
            confirmButton: 'swal-confirm-btn',
          },
        });
      }
    }
  };

  const handleMoveToWishlist = async (cartItemId, name) => {
    try {
      const result = await Swal.fire({
        title: 'Mover a lista de deseos',
        html: `¿Estás seguro que deseas mover <strong>${name}</strong> a la lista de deseos?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Volver',
        background: '#f0f0f0',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'swal-confirm-btn',
          cancelButton: 'swal-cancel-btn',
        },
      });

      if (result.isConfirmed) {
        await cartService.moveToWishlist(cartItemId);
        
        // Recargar carrito
        const items = await cartService.getCart(currentUser.id);
        setCartItems(items);
        calculateTotals(items);
        
        Swal.fire({
          title: '¡Movido!',
          text: `${name} se ha movido a la lista de deseos`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Hubo un error al mover el producto',
        icon: 'error',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'swal-confirm-btn',
        },
      });
    }
  };

  const calculateTotals = (items) => {
    const subtotalValue = items.reduce(
      (sum, item) => sum + (Number(item.price) * Number(item.quantity)),
      0
    );
    const totalItemsCount = items.reduce((sum, item) => sum + Number(item.quantity), 0);
    
    setSubtotal(subtotalValue);
    setTotal(totalItemsCount);
  };

  // Si es invitado, mostrar mensaje diferente
  if (isGuest) {
    return (
      <MyCart>
        <div className="mycart">
          <div className="guest-message">
            <h2>Modo Invitado</h2>
            <p>Los invitados no tienen carrito en base de datos.</p>
            <p>Por favor <a href="/auth/login">inicia sesión</a> para ver tu carrito.</p>
          </div>
        </div>
      </MyCart>
    );
  }

  if (loading) {
    return (
      <MyCart>
        <div className="loading-container">
          <p>Cargando carrito...</p>
        </div>
      </MyCart>
    );
  }

  return (
    <MyCart>
      <div className="mycart">
        <div className="mycart-contain">
          <div className="mycart-contain-header">
            <h2>Mi carrito ({total})</h2>
            {currentUser && (
              <small className="user-info">
                Usuario: {currentUser.name} {currentUser.lastname}
              </small>
            )}
          </div>
          <div className="mycart-contain-items">
            {!Array.isArray(cartItems) || cartItems.length === 0 ? (
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
                  onRemove={() => handleRemoveFromCart(item.id, item.name)}
                  onWishlist={() => handleMoveToWishlist(item.id, item.name)}
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
            <strong>$0</strong>
          </div>
          <div className="mycart-flex">
            <p>Total:</p> 
            <strong>${formatPrice(subtotal)}</strong>
          </div>
          <BaseButton
            textLabel={true}
            label={`Pagar (${total})`}
            icon={"pay"}
            classs={'button primary'} 
            $colorbtn={"var(--bg-primary)"}
            $colortextbtnprimary={"var(--light)"}
            $colorbtnhoverprimary={"var(--bg-primary-tr)"}
            $colortextbtnhoverprimary={"white"}  
            disabled={!isAuthenticated || cartItems.length === 0}
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

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 18px;
    color: #666;
  }

  .guest-message {
    text-align: center;
    padding: 40px;
    background: #f5f5f5;
    border-radius: 8px;
    margin: 20px;
    
    h2 {
      color: #ff9800;
      margin-bottom: 15px;
    }
    
    p {
      margin: 10px 0;
    }
    
    a {
      color: #1976d2;
      text-decoration: underline;
      font-weight: bold;
    }
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
        padding: 10px;
        
        .user-info {
          color: #666;
          font-size: 14px;
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
`;