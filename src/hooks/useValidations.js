import { useRef } from "react";

export const useValidations = () => {

  const formRefs = {
    name: useRef(null),
    price: useRef(null),
    previousPrice: useRef(null),
    brand: useRef(null),
    category: useRef(null),
    subCategory: useRef(null),
    description: useRef(null),
    stock: useRef(null),
    variants: useRef([])
  };

  /* =========================
     NORMALIZADOR (CLAVE 🔥)
  ========================= */
  const normalizeValue = (val) => {
    if (val === null || val === undefined) return "";
    return typeof val === "string" ? val : String(val);
  };

  /* =========================
     STYLES ERROR
  ========================= */
  const setFieldErrorStyle = (fieldName, hasError) => {
    const fieldRef = formRefs[fieldName]?.current;

    if (!fieldRef || !fieldRef.style) return;

    fieldRef.style.cssText = hasError
      ? "border: 1px solid red; border-radius: 10px;"
      : "border: 1px solid #34B0BE; border-radius: 10px;";
  };

  /* =========================
     VALIDADOR GENÉRICO
  ========================= */
  const validateField = (fieldName, value, validationFn, errorMessage) => {
    const val = normalizeValue(value);

    if (!val) {
      setFieldErrorStyle(fieldName, true);
      return errorMessage.required;
    }

    if (validationFn && !validationFn(val)) {
      setFieldErrorStyle(fieldName, true);
      return errorMessage.invalid;
    }

    setFieldErrorStyle(fieldName, false);
    return null;
  };

  /* =========================
     VALIDACIÓN PRINCIPAL
  ========================= */
  const validateForm = (form) => {
    let errors = {};

    const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    const regexPrice = /^\d+(\.\d{1,2})?$/;

    /* =========================
       CAMPOS BÁSICOS
    ========================= */

    errors.name = validateField(
      "name",
      form.name,
      (val) => regexName.test(val),
      {
        required: "Nombre requerido",
        invalid: "Solo letras permitidas"
      }
    );

    errors.price = validateField(
      "price",
      form.price,
      (val) => regexPrice.test(val),
      {
        required: "Precio requerido",
        invalid: "Formato inválido"
      }
    );

    errors.previousPrice = validateField(
      "previousPrice",
      form.previousPrice,
      (val) => regexPrice.test(val),
      {
        required: "Precio anterior requerido",
        invalid: "Formato inválido"
      }
    );

    errors.category = validateField(
      "category",
      form.category,
      null,
      { required: "Categoría requerida" }
    );

    errors.stock = validateField(
      "stock",
      form.stock,
      null,
      { required: "Stock requerido" }
    );

    errors.description = validateField(
      "description",
      form.description,
      null,
      { required: "Descripción requerida" }
    );

    /* =========================
       VARIANTES (COLORES 🔥)
    ========================= */

    if (form.variants && form.variants.length > 0) {

      form.variants.forEach((variant, index) => {

        const name = normalizeValue(variant.name);
        const price = normalizeValue(variant.price);
        const stock = normalizeValue(variant.stock);

        // Validar color
        if (!name) {
          errors[`variant_name_${index}`] = "Color requerido";
        }

        // Validar precio
        if (!price || !regexPrice.test(price)) {
          errors[`variant_price_${index}`] = "Precio inválido";
        }

        // Validar stock
        if (!stock || isNaN(Number(stock))) {
          errors[`variant_stock_${index}`] = "Stock inválido";
        }

      });

    }

    /* =========================
       LIMPIAR ERRORES
    ========================= */
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    return errors;
  };

  return { formRefs, validateForm };
};
 
