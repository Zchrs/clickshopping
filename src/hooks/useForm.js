/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import { helpHttp } from "../helpers/helperHttp";
import { Form, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  startLogin,
  startLoginAdmin,
  loginSuccess,
} from "../actions/authActions";
import { fetchWithoutToken } from "../helpers/fetch";
import Swal from "sweetalert2";

export const initialForm = {
  name: "",
  lastname: "",
  country: "",
  dialCode: "",
  zipCode: "",
  phone: "",
  email: "",
  password: "",
  brand: "",
  price: "",
  previousPrice: "",
  category: "",
  subCategory: "",
  color: "",
  stock: "",
  quantity: "",
  description: "",
  img_url: [],
  user_id: "",
  product_id: "",

  fullname: "",
  pass: "",
  codeAccess: "",
  creditCard: "",
  paymentMethod: "",
  bank: "",
  wallet: "",
  cardNumber: "",
  accountNumber: "",
  moneybrokerAccount: "",
  variants: [{ name: "", price: "", stock: "" }],
};

export const useForm = (initialForm, validateForm, countries = []) => {
  // ---------------- variables de estado -----------------------
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [errorsCart, setErrorsCart] = useState({});
  // const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [response, setResponse] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const tokenAdmin = useSelector((state) => state.authAdmin.token);
  // ----------------- funciones form -------------------------

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadingActive = (email, password) => {
    setLoading(true);
    return async (dispatch) => {
      const res = await fetchWithoutToken(
        "auth/login",
        { email, password },
        "POST",
      );
      const body = await res.json();
      if (body.ok) {
        dispatch(
          loginSuccess({
            name: body.user.name,
          }),
        );
      }
      setLoading(false);
    };
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;

    const selectedCountry = countries.find((c) => c.value === countryCode);

    if (!selectedCountry) {
      setForm((prev) => ({
        ...prev,
        country: "",
        dialCode: "",
        phone: "",
      }));
      return;
    }

    setForm((prev) => {
      const phoneWithoutDial = prev.phone.replace(/^\+\d+[-\d]*\s?/, "");

      return {
        ...prev,
        country: countryCode,
        dialCode: selectedCountry.dialCode,
        phone: `${selectedCountry.dialCode} ${phoneWithoutDial}`.trim(),
      };
    });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    setForm((prev) => {
      if (!prev.dialCode) {
        return { ...prev, phone: value };
      }

      if (!value.startsWith(prev.dialCode)) {
        return {
          ...prev,
          phone: prev.dialCode + " ",
        };
      }

      return { ...prev, phone: value };
    });
  };

  const handleGuestChange = (value, field) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field !== "creditCard" && { creditCard: "" }),
      ...(field !== "bank" && { bank: "" }),
      ...(field !== "wallet" && { wallet: "" }),
    }));
  };
  const handleClearCountry = (label, value) => {
    if (label) {
      setSelectedCountry(null);
      setSelected(null);
      console.log(value);
    }
    setForm({
      ...form,
      country: "",
      countryCode: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(value)
    setForm({
      ...form,
      [name]: value,
    });

    if (value === "email") {
      validateEmails(name);
    } else {
      return;
    }
  };

  const handleChangeAdmin = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setForm({
      ...form,
      [name]: value,
    });

    if (value === "email") {
      validateEmails(name);
    } else {
      return;
    }
  };

  const handleChecked = (e, checked) => {
    setChecked(e.target.checked);
  };

  const openModal = () => {
    setModal(true);
    console.log("click");
  };

  const handleSetImage = (imageUrls) => {
    setForm({
      ...form,
      img_url: imageUrls,
    });
  };

  const handleSetImages = (imageUrls) => {
    setForm({
      ...form,
      img_url: imageUrls,
    });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const imgUrls = files.map((file) => URL.createObjectURL(file));
    setForm((form) => ({
      ...form,
      img_url: imgUrls, // Guardar las URLs de las imágenes
    }));
  };

  // formularios y estados del producto
  const handleChangeProduct = (e) => {
    const { name, value } = e.target;
    // console.log(value)
    setForm({
      ...form,
      [name]: value,
    });
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", price: "", stock: "" }],
    }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) => {
        if (i === index) {
          return {
            ...variant,
            [field]:
              field === "price" || field === "stock"
                ? Number(value) || 0
                : value,
          };
        }
        return variant;
      }),
    }));
  };

  const handleUpdateProduct = async (id) => {
    setLoading(true);

    Swal.fire({
      title: "Estás actualizando un producto",
      text: "¿Deseas continuar actualizando este producto?",
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
      },
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("name", form.name);
          formData.append("price", form.price);
          formData.append("previousPrice", form.previousPrice);
          formData.append("category", form.category);
          formData.append("quantity", form.quantity);
          formData.append("description", form.description);
          formData.append("img_url", form.img_url);
          const response = axios.put(
            `${import.meta.env.VITE_APP_API_UPDATE_PRODUCT_URL}/${id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
              },
            },
          );

          if (response.status === 200) {
            Swal.fire({
              title: "¡Éxito!",
              text: "Producto actualizado correctamente.",
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
            console.log("Product updated successfully", response.data);
          } else {
            console.log("Failed to update product", response.data);
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Hubo un error al intentar actualizar este producto.",
            icon: "error",
            background: "#f0f0f0",
            customClass: {
              popup: "swal-custom-popup",
              title: "custom-title",
              content: "custom-content",
              confirmButton: "swal-confirm-btn",
            },
          });
          setLoading(false);
          throw error.response?.data || error.message;
        }
      } else {
        return;
      }
    });
  };

  const handleSubmitProduct = async (e, sellerId) => {
    e.preventDefault();

    const token = tokenAdmin || localStorage.getItem("tokenAdmin");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "No hay sesión de administrador",
        customClass: {
          popup: "swal-custom-popup",
          title: "swal-custom-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
      });
      return;
    }

    // Validar que haya al menos una variante válida
    const validVariants = form.variants.filter((v) => v.name && v.stock);

    if (validVariants.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Debes agregar al menos una variante con color, precio y stock",
        customClass: {
          popup: "swal-custom-popup",
          title: "swal-custom-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
      });
      return;
    }

    const formData = {
      name: form.name,
      description: form.description,
      price: form.price,
      previousPrice: form.previousPrice,
      category: form.category,
      subCategory: form.subCategory,
      sellerId: sellerId,
      brand: form.brand,
      variants: validVariants, // Enviar variantes válidas
      img_url: form.img_url,
    };

    if (!Array.isArray(formData.img_url) || formData.img_url.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Debes subir al menos una imagen",
        customClass: {
          popup: "swal-custom-popup",
          title: "swal-custom-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "¿Agregar producto?",
      text: `Se agregará con ${validVariants.length} variante(s) de color`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      background: "#f0f0f0",
      customClass: {
        popup: "swal-custom-popup",
        title: "swal-custom-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      Swal.fire({
        title: "Agregando producto...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        import.meta.env.VITE_APP_API_UPLOAD_PRODUCT_URL,
        formData,
        {
          headers: {
            "x-token": token,
            "Content-Type": "application/json",
          },
        },
      );

      setResponse(true);
      setForm(initialForm);

      Swal.fire({
        icon: "success",
        title: "Producto agregado correctamente",
        html: `Se agregaron ${validVariants.length} variante(s) de color`,
        confirmButtonText: "Continuar",
        customClass: {
          popup: "swal-custom-popup",
          title: "swal-custom-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
      });
    } catch (error) {
      console.error("Error al crear producto:", error);

      Swal.fire({
        icon: "error",
        title: "Error al crear el producto",
        text: error?.response?.data?.message || "Intenta nuevamente",
        customClass: {
          popup: "swal-custom-popup",
          title: "swal-custom-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!id || typeof id === "object") {
      console.error("❌ deleteProduct recibió algo inválido:", id);
      return;
    }
    try {
      const result = await Swal.fire({
        title: "Vas a eliminar un producto",
        text: "¡Estás seguro que deseas eliminar este producto?",
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
          cancelButton: "custom-cancel-button",
        },
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `${import.meta.env.VITE_APP_API_DELETE_PRODUCT_URL}/${id}`,
        );
        console.log(response.data); // Mensaje de éxito o información adicional
        Swal.fire({
          title: "Eliminado!",
          text: "El producto ha sido eliminado exitosamente.",
          icon: "success",
          background: "#f0f0f0",
          customClass: {
            popup: "swal-custom-popup",
            title: "custom-title",
            content: "custom-content",
            confirmButton: "swal-confirm-btn",
          },
        });
        return response.data;
      } else {
        return;
      }
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message,
      );
      Swal.fire({
        title: "Error",
        text: "Hubo un error al intentar eliminar el producto.",
        icon: "error",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
        },
      });
      throw error.response?.data || error.message;
    }
  };
  // fin de funciones y estados del producto

  const validateEmails = async (email) => {
    const finalForm = {
      ...form,
    };
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_API_REGISTER,
        finalForm,
        {
          // const response = await axios.post("http://localhost:4000/api/auth/register", finalForm, {

          body: email,
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        },
      );
    } catch (error) {
      console.log(error, "error al verificar emails desde front");
      return;
    }
  };

  const handleBlur = (e) => {
    handleChange(e);
    setErrors(validateForm(form));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateForm);

    if (Object.keys(errors).length === 0) {
      alert("Enviando...");
      setLoading(true);

      console.log("EJECUTANDO LA FUNCIÓN");

      helpHttp()
        .post("http://localhost:4000/api/auth/register", {
          body: Form,
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          setLoading(false);
          setResponse(true);
          setForm(initialForm);
          setTimeout(
            () => setResponse(false, initialForm, window.location.reload()),
            500,
          );
        });
    } else {
      return;
    }
  };

  const handleLogin = (e) => {
    if (!form.email) return;
    if (!form.password) return;

    Swal.fire({
      title: "Iniciando sesión...",
      text: "Validando credenciales",
      allowOutsideClick: false,
      background: "#f9fafb",
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm-btn",
      },
      didOpen: () => Swal.showLoading(),
    });
    e.preventDefault();
    dispatch(startLogin(form.email, form.password));
  };

const handleSubmitAddCart = async (product, quantity = 1, activeColor) => {
  if (!product) return;

  // ✅ NORMALIZAR COLORES
  const colors = product.colors || [];
  const hasMultipleColors = Array.isArray(colors) && colors.length > 1;

  // ✅ VALIDACIÓN CLAVE
  if (hasMultipleColors && !activeColor) {
    Swal.fire({
      title: "Selecciona un color",
      text: "Debes elegir un color antes de agregar al carrito",
      icon: "warning",
      customClass: {
        popup: "swal-custom-popup",
        title: "custom-title",
        content: "custom-content",
        confirmButton: "swal-confirm-btn",
      },
    });
    return; // 🔴 IMPORTANTE: detener ejecución
  }

  setLoading(true);

  try {
    const token = user?.token || null;

    // ✅ COLOR FINAL
    const finalColor =
      hasMultipleColors
        ? activeColor
        : colors.length === 1
        ? colors[0]
        : null;

    // ---------------- USUARIO LOGUEADO ----------------
    if (user && user.id) {
      const payload = {
        user_id: user.id,
        product_id: product.id,
        variant_id: product.variant_id || null,
        price: product.price || product.previousPrice,
        quantity,
        color: finalColor, // ✅ agregado
      };

      console.log("📝 Enviando al carrito (usuario):", payload);

      await axios.post(
        import.meta.env.VITE_APP_API_POST_CART_URL,
        payload,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ---------------- USUARIO INVITADO ----------------
    else {
      let guestId = localStorage.getItem("guest_id");

      if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        localStorage.setItem("guest_id", guestId);
      }

      let guestUser = localStorage.getItem("guestUser");
      let guestData = guestUser ? JSON.parse(guestUser) : null;

      if (!guestData) {
        guestData = {
          id: guestId,
          name: "Invitado",
          role: "guest",
          guest: true,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("guestUser", JSON.stringify(guestData));
      }

      // ✅ PRODUCTO CON COLOR FINAL
      const productData = {
        id: product.id,
        product_id: product.id,
        guest_id: guestId,
        name: product.name,
        price: product.price || product.previousPrice,
        color: finalColor, // ✅ FIX
        quantity,
        img:
          Array.isArray(product.images)
            ? product.images[0]
            : product.img_url || product.image || "",
        img_urls: Array.isArray(product.images)
          ? product.images
          : product.img_urls || [],
        variant_id: product.variant_id || null,
        added_at: new Date().toISOString(),
      };

      console.log("📝 Agregando al carrito:", productData);

      const CART_STORAGE_KEY = "cart";
      let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

      const existingIndex = cart.findIndex(
        (item) =>
          item.product_id === product.id &&
          item.guest_id === guestId &&
          item.color === finalColor // ✅ IMPORTANTE
      );

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push(productData);
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

      window.dispatchEvent(
        new CustomEvent("cart-updated", { detail: { cart } })
      );
    }

    // ---------------- SUCCESS ----------------
    const productName =
      product.name || product.title || "Producto";

    Swal.fire({
      title: "¡Producto agregado!",
      text: `${productName} fue agregado al carrito`,
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Ir al carrito",
      cancelButtonText: "Seguir comprando",
      customClass: {
        popup: "swal-custom-popup",
        title: "custom-title",
        content: "custom-content",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const guestId = localStorage.getItem("guest_id");
        navigate(guestId ? "/cart-guest" : "/dashboard/my-cart");
      }
    });

  } catch (error) {
    console.error("❌ ERROR CART:", error.response?.data || error.message);

    Swal.fire({
      title: "Error",
      text:
        error?.response?.data?.message ||
        "No se pudo agregar el producto",
      icon: "error",
    });
  } finally {
    setLoading(false);
  }
};

  const handleSubmitAddWishlist = async (e) => {
    const finalFormAddWishlist = {
      ...form,
    };
    e.preventDefault();
    setLoading(true);

    try {
      const token = user.token;
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_POST_WISHLIST_URL}/${form.product_id}`,
        finalFormAddWishlist,
        {
          body: finalFormAddWishlist,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
            Accept: "application/json",
          },
        },
      );
      console.log(response);
      setLoading(false);
      setResponse(true);
      setForm(initialForm);
      // setTimeout(() => setResponse(false, initialForm, ));
      setTimeout(
        () =>
          setResponse(
            false,
            initialForm,
            Swal.fire({
              title: "¡Correcto!",
              text: `Agregaste un producto en la lista de deseos!`,
              icon: "success",
              showCancelButton: false,
              confirmButtonText: "Volver",
              cancelButtonText: "Volver",
              background: "#f0f0f0",
              customClass: {
                popup: "swal-custom-popup",
                title: "custom-title",
                content: "custom-content",
                confirmButton: "swal-confirm-btn",
              },
            }),
          ),
        200,
      );
    } catch (error) {
      Swal.fire({
        title: "No se pudo agregar al carrito",
        text: "Regresa al producto e inténtalo de nuevo",
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "Volver",
        cancelButtonText: "Volver",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
        },
      });
      return;
    }
  };

  const handleBlurAdm = (e) => {
    handleChange(e);
    setErrors(validateForm(form));
  };

  const handleSubmitsAdmin = async (e, label) => {
    const finalForm = {
      ...form,
    };
    if (!finalForm.fullname) return;
    if (!finalForm.email) return;
    if (!finalForm.pass) return;
    if (!finalForm.codeAccess) return;

    e.preventDefault();
    setErrors(validateForm);
    setLoading(true);
    try {
      helpHttp();
      const response = await axios.post(
        import.meta.env.VITE_APP_API_REGISTER_ADMIN_URL,
        finalForm,
        {
          // const response = await axios.post("http://192.168.1.2:3000/api/auth/register", finalForm, {

          body: finalForm,
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        },
      );
      setLoading(false);
      setResponse(true);
      setForm(initialForm);
      setTimeout(
        () =>
          setResponse(
            false,
            initialForm,
            (window.location.href =
              import.meta.env.VITE_APP_API_LOGIN_ADMIN_FRONT),
          ),
        200,
      );
    } catch (error) {
      console.log(error.response.data);
      alert(`${error.response.data}`);
      return;
    }
    setLoading(false);
    setModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imgUrls = files.map((file) => URL.createObjectURL(file));
    setForm((form) => ({
      ...form,
      img_url: imgUrls, // Guardar las URLs de las imágenes
    }));
  };

  const handleLoginAdmin = (e) => {
    if (!form.email) return;
    if (!form.password) return;

    Swal.fire({
      title: "Iniciando sesión...",
      text: "Validando credenciales",
      allowOutsideClick: false,
      background: "#f9fafb",
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm-btn",
      },
      didOpen: () => Swal.showLoading(),
    });
    e.preventDefault();
    dispatch(startLoginAdmin(form.email, form.password));

    // console.log(form)
    loadingActive();
    navigate("/admin/dashboard");
  };

  const handleSubmits = async (e, label) => {
    const finalForm = {
      ...form,
    };
    if (!finalForm.country) return;
    if (!finalForm.name) return;
    if (!finalForm.lastname) return;
    if (!finalForm.phone) return;
    if (!finalForm.email) return;
    if (!finalForm.password) return;

    e.preventDefault();
    setErrors(validateForm);
    setLoading(true);
    try {
      helpHttp();
      console.log("API URL:", import.meta.env.VITE_APP_API_REGISTER_URL);
      const response = await axios.post(
        import.meta.env.VITE_APP_API_REGISTER_URL,
        finalForm,
        {
          body: finalForm,
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        },
      );
      console.log(response);
      setLoading(false);
      setResponse(true);
      setForm(initialForm);
      // setTimeout(() => setResponse(false, initialForm, ));
      setTimeout(
        () =>
          setResponse(
            false,
            initialForm,
            Swal.fire({
              title: "¡Hecho!",
              html: `Te has registrado correctamente`,
              icon: "success",
              showCancelButton: false,
              cancelButtonText: "Volver",
              background: "#f0f0f0",
              customClass: {
                popup: "swal-custom-popup",
                title: "custom-title",
                content: "custom-content",
                confirmButton: "swal-confirm-btn",
                cancelButton: "custom-cancel-button",
              },
            }),
          ),
        200,
      );
    } catch (error) {
      Swal.fire({
        title: "¡Error!",
        html: `No se pudo registrar el usuario`,
        icon: "warning",
        cancelButtonText: "Reintentar",
        confirmlButtonText: "Reintentar",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
          cancelButton: "custom-cancel-button",
        },
      });
      console.log(error);
      return;
    }
    setLoading(false);
    setModal(true);
  };

  const handleSubscribeNewsletter = async (e) => {
    const finalForm = {
      ...form,
    };
    // if (!finalForm.email) return;
    if (!finalForm.email || !checked) {
      prompt("Debes aceptar los términos y condiciones");
      return;
    }
    e.preventDefault();
    setErrors(validateForm);
    setLoading(true);
    try {
      helpHttp();
      const response = await axios.post(
        import.meta.env.VITE_APP_API_NEWSLETTER_URL,
        finalForm,
        {
          body: finalForm,
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        },
      );
      console.log(response);
      setLoading(false);
      setResponse(true);
      setForm(initialForm);
      prompt("Te has suscrito a nuestro boletín");
    } catch (error) {
      console.log(error);
      prompt(error);
      return;
    }
    setLoading(false);
    setModal(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!form.password || !form.rePassword) return;

    const finalForm = {
      email: form.email,
      password: form.password,
    };

    debugger;

    setErrors(validateForm);
    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_API_RESET_PASSWORD,
        finalForm,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      console.log(response.data);
      setResponse(true);
      setForm(initialForm);
      setLoading(false);

      Swal.fire({
        title: "¡Hecho!",
        html: `Contraseña cambiada correctamente`,
        icon: "success",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
        },
      }).then(() => {
        navigate("/auth/login"); // ✅ Redirige después del éxito
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "¡Error!",
        html: `Error al cambiar la contraseña`,
        icon: "warning",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
        },
      });
    } finally {
      setLoading(false);
      setModal(true);
    }
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();

    const finalForm = { ...form };
    if (!finalForm.email) return false;

    setErrors(validateForm);
    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_API_REQUEST_RECOVERY_CODE,
        { email: finalForm.email }, // solo necesitas enviar el email
        {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        },
      );

      console.log(response);
      setLoading(false);
      setResponse(true);

      setTimeout(() => {
        setResponse(false);
        Swal.fire({
          title: "¡Hecho!",
          html: `Código enviado a: <b>${finalForm.email}</b>`,
          icon: "success",
          background: "#f0f0f0",
          customClass: {
            popup: "swal-custom-popup",
            title: "custom-title",
            content: "custom-content",
            confirmButton: "swal-confirm-btn",
          },
        });
      }, 200);

      return true; // ✅ Éxito
    } catch (error) {
      console.error("Error al solicitar el código:", error);
      setLoading(false);
      return false; // ❌ Fallo
    }
  };

  const handleVerifyCode = async (e, { email, code }) => {
    if (e?.preventDefault) e.preventDefault();

    setErrors("");
    setMessage("");

    if (!/^\d{6}$/.test(code)) {
      setErrors("El código debe tener 6 dígitos numéricos.");
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_APP_API_VERIFY_CODE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const result = await res.json();

      if (!res.ok) {
        Swal.fire({
          title: "¡Error!",
          html: result?.error || "Código inválido o expirado.",
          icon: "warning",
          background: "#f0f0f0",
          customClass: {
            popup: "swal-custom-popup",
            title: "custom-title",
            content: "custom-content",
            confirmButton: "swal-confirm-btn",
          },
        });
        return;
      }

      Swal.fire({
        title: "¡Hecho!",
        html: "¡Código correcto!",
        icon: "success",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
        },
      });

      setMessage("Código verificado.");
      return true;
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "¡Error!",
        html: "Código inválido o expirado.",
        icon: "warning",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
        },
      });
      return false;
    }
  };

  return {
    form,
    errorsCart,
    errors,
    loading,
    response,
    modal,
    deleteProduct,
    handleChangeProduct,
    setForm,
    setLoading,
    handleImageChange,
    handleChangeAdmin,
    handleBlurAdm,
    handleSubmitsAdmin,
    handleSubmitAddCart,
    handleSubmitProduct,
    handleSetImage,
    handleSetImages,
    handleImagesChange,
    handleChecked,
    loadingActive,
    handleChange,
    handleBlur,
    handleSubmit,
    handleSubmits,
    handleLogin,
    handleLoginAdmin,
    handleSubscribeNewsletter,
    handleGuestChange,
    handleClearCountry,
    handleUpdateProduct,
    openModal,
    handleCountryChange,
    handleSubmitAddWishlist,
    handleRequestCode,
    handleChangePassword,
    handlePhoneChange,
    handleVerifyCode,
    addVariant,
    removeVariant,
    handleVariantChange,
  };
};
