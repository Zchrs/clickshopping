/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatPrice } from "../../../globalActions";
import { BaseButton } from "../../components/globals/BaseButton";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { BaseCheckbox, BaseInput } from "../../../index";
import { useForm } from "../../hooks/useForm";
import { useValidations } from "../../hooks/useValidations";
import banksData from "../../../banks.json";

export const CheckOut = () => {
  const location = useLocation();
  const { formRefs, validateForm } = useValidations();

  const locationState =
    location.state || JSON.parse(localStorage.getItem("checkout_data")) || {};

  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);

  const [paying, setPaying] = useState(false);
  const [paymentMethodState, setPaymentMethodState] = useState("");

  const isGuest = locationState?.guest || false;
  const currentUser = isGuest ? locationState.user : authUser;

  const products = locationState?.products || [];
  console.log(products, "constante products");

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const initialForm = {
    name: "",
    lastname: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: ""
  };

  const { form, setForm, handleChange, handleBlur, handleGuestChange } =
    useForm(initialForm, validateForm);

const handlePaymentMethod = (method) => {
  setPaymentMethodState(method);

  setForm({
    ...form,
    creditCard: "",
    bank: "",
    wallet: "",
  });
};

  const isGuestInfoComplete = () => {
    return (
      form.name &&
      form.lastname &&
      form.email &&
      form.address &&
      form.city &&
      form.zipCode &&
      (form.creditCard || form.bank || form.wallet)
    );
  };

  const bankOptions = banksData.colombia_financial_entities.banks.map(
    (bank) => ({
      value: bank,
      label: bank,
    })
  );

  const moneyBrokersOptions =
    banksData.colombia_financial_entities.money_brokers_fintech.map((b) => ({
      value: b,
      label: b,
    }));

  const creditCardsOptions =
    banksData.colombia_financial_entities.card_networks.map((b) => ({
      value: b,
      label: b,
    }));

  const handlePay = async () => {
    if (!currentUser) {
      Swal.fire("Debes iniciar sesión", "Inicia sesión para pagar", "warning");
      return;
    }

    if (!products.length) {
      Swal.fire("Carrito vacío", "No hay productos para pagar", "info");
      return;
    }

    if (isGuest && !isGuestInfoComplete()) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Debes llenar el formulario para continuar",
      });
      return;
    }

    setPaying(true);

    Swal.fire({
      title: "Procesando pedido...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const payload = {
        user_id: currentUser.id,
        product_ids: products.map((p) => p.product_id),
      };

if (isGuest) {

  let paymentMethod = "";

  if (paymentMethodState === "card") {
    paymentMethod = form.creditCard;
  }

  if (paymentMethodState === "bank") {
    paymentMethod = form.bank;
  }

  if (paymentMethodState === "wallet") {
    paymentMethod = form.wallet;
  }

  payload.guest_info = {
    name: form.name,
    lastname: form.lastname,
    email: form.email,
    address: form.address,
    city: form.city,
    zipCode: form.zipCode,
    paymentMethod
  };

  payload.is_guest = true;
}

      const res = await axios.post(
        import.meta.env.VITE_APP_API_PAY_ORDER_URL,
        payload
      );

      Swal.fire({
        icon: "success",
        title: "Pedido creado",
        text: res.data.message,
      });

      if (isGuest) {
        navigate("/");
      } else {
        navigate("/dashboard/orders");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error?.response?.data?.error || "No se pudo crear el pedido",
      });
    } finally {
      setPaying(false);
    }
  };

  if (!products.length) {
    return (
      <section className="checkout">
        <h2>No hay productos para pagar</h2>

        <BaseButton
          textLabel
          classs={"button primary"}
          label="Volver al carrito"
          handleClick={() => navigate("/dashboard/my-cart")}
        />
      </section>
    );
  }

  return (
    <section className="checkout">
      <div className="checkout-left">
        {isGuest ? (
          <form className="checkout-left-guest">
            <h2>Pago e información personal</h2>

            <div className="checkout-left-guest-form">
              <div className="twocolumns">
                Nombre:
                <BaseInput
                  inputRef={formRefs.name}
                  classs={"inputs normal"}
                  id="name"
                  name="name"
                  placeholder="Nombre"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div className="twocolumns">
                Apellido:
                <BaseInput
                  inputRef={formRefs.lastname}
                  classs={"inputs normal"}
                  id="lastname"
                  name="lastname"
                  placeholder="Apellido"
                  value={form.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="checkout-left-guest-form">
              <div className="twocolumns">
                Correo:
                <BaseInput
                  inputRef={formRefs.email}
                  classs={"inputs normal"}
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isEmail
                />
              </div>

              <div className="twocolumns">
                Dirección:
                <BaseInput
                  inputRef={formRefs.address}
                  classs={"inputs normal"}
                  name="address"
                  id="address"
                  placeholder="Dirección"
                  value={form.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="checkout-left-guest-form">
              <div className="twocolumns">
                Ciudad:
                <BaseInput
                  inputRef={formRefs.city}
                  classs={"inputs normal"}
                  name="city"
                  id="city"
                  placeholder="Ciudad"
                  value={form.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div className="twocolumns">
                Código postal:
                <BaseInput
                  inputRef={formRefs.zipCode}
                  classs={"inputs normal"}
                  name="zipCode"
                  id="zipCode"
                  placeholder="Código postal"
                  value={form.zipCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isNumber
                />
              </div>
            </div>

            <div className="checkout-left-guest">
              <h2>Métodos de pago</h2>

              <div className="twocolumns">
                <label className="flex-s">
                  <BaseCheckbox
                    modelValue={paymentMethodState === "card"}
                    valueChange={() => handlePaymentMethod("card")}
                  />
                  Tarjetas
                </label>
                {paymentMethodState === "card" && (
                  <BaseInput
                    inputRef={formRefs.creditCard}
                    isSearchableSelect
                    isSelect
                    classs={"inputs normal"}
                    name="creditCard"
                    id="creditCard"
                    options={creditCardsOptions}
                    value={form.creditCard}
                    onChange={(e) =>
                      handleGuestChange(e.target.value, "creditCard")
                    }
                    onBlur={handleBlur}
                  />
                )}
              </div>

              <div className="twocolumns">
                <label className="flex-s">
                  <BaseCheckbox
                    modelValue={paymentMethodState === "bank"}
                    valueChange={() => handlePaymentMethod("bank")}
                  />
                  Bancos
                </label>
                {paymentMethodState === "bank" && (
                  <BaseInput
                    inputRef={formRefs.bank}
                    isSearchableSelect
                    isSelect
                    classs={"inputs normal"}
                    name="bank"
                    id="bank"
                    options={bankOptions}
                    value={form.bank}
                    onChange={(e) => handleGuestChange(e.target.value, "bank")}
                    onBlur={handleBlur}
                  />
                )}
              </div>

              <div className="twocolumns">
                <label className="flex-s">
                  <BaseCheckbox
                    modelValue={paymentMethodState === "wallet"}
                    valueChange={() => handlePaymentMethod("wallet")}
                  />
                  Moneybrokers
                </label>
                {paymentMethodState === "wallet" && (
                  <BaseInput
                    inputRef={formRefs.wallet}
                    isSearchableSelect
                    isSelect
                    classs={"inputs normal"}
                    name="wallet"
                    id="wallet"
                    options={moneyBrokersOptions}
                    value={form.wallet}
                    onChange={(e) =>
                      handleGuestChange(e.target.value, "wallet")
                    }
                    onBlur={handleBlur}
                  />
                )}
              </div>
            </div>
          </form>
        ) : (
          <>
            <h2>Dirección de entrega</h2>

            <div className="checkout-info">
              <p>Nombre:</p>
              <strong>
                {currentUser.name} {currentUser.lastname}
              </strong>
            </div>

            <div className="checkout-info">
              <p>Dirección:</p>
              <strong>{currentUser.address}</strong>
            </div>

            <div className="checkout-info">
              <p>Correo:</p>
              <strong>{currentUser.email}</strong>
            </div>

            <div className="checkout-info">
              <p>Ciudad:</p>
              <strong>{currentUser.city}</strong>
            </div>

            <div className="checkout-info">
              <p>Código postal:</p>
              <strong>{currentUser.zipCode}</strong>
            </div>
          </>
        )}

        <div className="checkout-left-boxproducts">
          {products.map((item) => (
            <div key={item.product_id} className="checkout-left-img">
              {console.log(item, "desde el map")}
              <img
                src={
                  item.img ||
                  item.image ||
                  item.img_url ||
                  "/images/no-image.png"
                }
                alt={item.name}
              />

              <div className="checkout-left-img-info">
                <h3>{item.name}</h3>
                <strong>{formatPrice(item.previousPrice)}</strong>

                <div className="checkout-left-info">
                  Cantidad: {item.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="checkout-right">
        <h2>Resumen</h2>

        <div className="checkout-left-info">
          <h4>Coste total de los artículos</h4>
          <p>COP {formatPrice(subtotal)}</p>
        </div>

        <div className="checkout-left-info">
          <h4>Total de envío</h4>
          <p>Gratis</p>
        </div>

        <div className="checkout-left-info">
          <h4>Total</h4>
          <strong>COP {formatPrice(subtotal)}</strong>
        </div>

        <BaseButton
          icon={"pay"}
          label={paying ? "Procesando..." : "Realizar pedido"}
          textLabel
          disabled={paying}
          classs={"button primary"}
          $colorbtn={"var(--danger)"}
          $colortextbtnprimary={"var(--light)"}
          $colorbtnhoverprimary={"var(--bg-primary-tr)"}
          $colortextbtnhoverprimary={"var(--light)"}
          handleClick={handlePay}
        />

        <p>
          Al hacer click en 'Realizar pedido', confirmo haber leído y aceptado{" "}
          <Link to={""}>los términos y condiciones.</Link>
        </p>
      </div>
    </section>
  );
};
