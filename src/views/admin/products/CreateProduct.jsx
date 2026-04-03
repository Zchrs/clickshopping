/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import styled from "styled-components";
import { useForm } from "../../../hooks/useForm";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  BaseButton,
  BaseInput,
  MultiDropZone,
  MultiDropZoneCloudinary,
} from "../../../../index";
import { useValidations } from "../../../hooks/useValidations";
import { useSelector } from "react-redux";

export const CreateProduct = () => {
  const { t } = useTranslation();
  const { formRefs, validateForm } = useValidations();
  const [isFormComplete, setIsFormComplete] = useState(null);
  const admin = useSelector((state) => state.authAdmin.admin);

  const initialForm = {
    name: "",
    price: "",
    previousPrice: "",
    category: "",
    subCategory: "",
    sellerId: admin.id,
    brand: "",
    stock: "",
    description: "",
    img_url: [],
    variants: [{ name: "", stock: "" }],
  };

  const {
    form,
    errors,
    loading,
    response,
    modal,
    setForm,
    handleChange,
    handleBlur,
    addVariant,
    removeVariant,
    handleSubmitProduct,
    handleSetImages,
    handleImagesChange,
    handleVariantChange,
  } = useForm(initialForm, validateForm);

  /* =========================
     VALIDACIÓN FORM
  ========================= */
  useEffect(() => {
    const isFormFilled = Object.entries(form)
      .filter(([key]) => key !== "img_url")
      .every(([_, value]) => value !== "");

    setIsFormComplete(isFormFilled);
  }, [form]);

  useEffect(() => {
    const totalStock = form.variants.reduce((acc, v) => {
      const stock = Number(v.stock) || 0;
      return acc + stock;
    }, 0);

    setForm((prev) => ({
      ...prev,
      stock: totalStock,
    }));
  }, [form.variants]);

  /* =========================
     PRECIO AUTOMÁTICO
  ========================= */
  const applyDiscount10 = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "";
    return Math.round(num * 0.9);
  };

  const handlePriceChange = (e) => {
    const { value } = e.target;

    setForm((prev) => ({
      ...prev,
      price: applyDiscount10(value),
      previousPrice: value,
    }));
  };

  /* =========================
     VARIANTS (COLORES)
  ========================= */

  return (
    <section className="sections">
      <ProductUpload className="uploadproducts">
        <h2 className="uploadproducts-h2">Agregar producto</h2>

        <form className="uploadproducts-form">
          {/* NOMBRE + PRECIO */}
          <div className="grid-4fr">
            <BaseInput
              id="name"
              name="name"
              placeholder="Nombre del producto"
              classs={"inputs normal"}
              inputRef={formRefs.name}
              value={form.name}
              onBlur={handleBlur}
              onChange={handleChange}
              required
            />

            <BaseInput
              id="price"
              name="price"
              placeholder="Precio"
              classs={"inputs normal"}
              inputRef={formRefs.price}
              value={form.price}
              onBlur={handleBlur}
              onChange={handleChange}
              isNumber
              required
            />

            <BaseInput
              id="previousPrice"
              name="previousPrice"
              placeholder="Precio anterior"
              classs={"inputs normal"}
              inputRef={formRefs.previousPrice}
              value={form.previousPrice}
              onChange={handlePriceChange}
              onBlur={handleBlur}
              required
              isNumber
            />

            <BaseInput
              id="category"
              name="category"
              placeholder="Categoría"
              classs={"inputs normal"}
              inputRef={formRefs.category}
              value={form.category}
              onBlur={handleBlur}
              onChange={handleChange}
              required
            />
          </div>

          {/* SUBCATEGORIA + MARCA + STOCK */}
          <div className="grid-4fr">
            <BaseInput
              id="subCategory"
              name="subCategory"
              placeholder="Subcategoría"
              classs={"inputs normal"}
              inputRef={formRefs.subCategory}
              value={form.subCategory}
              onBlur={handleBlur}
              onChange={handleChange}
            />

            <BaseInput
              id="brand"
              name="brand"
              placeholder="Marca"
              classs={"inputs normal"}
              inputRef={formRefs.brand}
              value={form.brand}
              onBlur={handleBlur}
              onChange={handleChange}
            />

            <BaseInput
              id="stock"
              name="stock"
              placeholder="Stock general"
              classs={"inputs normal"}
              inputRef={formRefs.stock}
              value={form.stock}
              onBlur={handleBlur}
              onChange={handleChange}
              isNumber
              disabled
              required
            />
          </div>

          {/* =========================
              VARIANTES (COLORES)
          ========================= */}
          <div>
            <h4>Colores / Variantes</h4>

            {form.variants.map((variant, index) => (
              <div key={index} className="grid-4fr">
                <BaseInput
                  inputRef={(el) => {
                    // Guardar referencia para cada variante
                    if (!formRefs.variants.current) {
                      formRefs.variants.current = [];
                    }
                    formRefs.variants.current[index] = {
                      ...formRefs.variants.current[index],
                      color: el,
                    };
                  }}
                  id={`color-${index}`}
                  name={`color-${index}`}
                  classs="inputs normal"
                  placeholder="Color (ej: rojo)"
                  value={variant.name || variant.color || ""}
                  onChange={(e) =>
                    handleVariantChange(index, "name", e.target.value)
                  }
                />
{/* 
                <BaseInput
                  id={`price-${index}`}
                  name={`price-${index}`}
                  classs="inputs normal"
                  placeholder="Precio"
                  value={variant.price || ""}
                  onChange={(e) =>
                    handleVariantChange(index, "price", e.target.value)
                  }
                  isNumber
                /> */}

                <BaseInput
                  inputRef={(el) => {
                    if (!formRefs.variants.current) {
                      formRefs.variants.current = [];
                    }
                    formRefs.variants.current[index] = {
                      ...formRefs.variants.current[index],
                      stock: el,
                    };
                  }}
                  id={`stock-${index}`}
                  name={`stock-${index}`}
                  classs="inputs normal"
                  placeholder="Stock"
                  value={variant.stock || ""}
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                  isNumber
                />

                <div className="flex-s">
                  <button
                    className="variants"
                    type="button"
                    onClick={addVariant}>
                    ➕
                  </button>
                  <button
                    className="variants"
                    type="button"
                    onClick={() => removeVariant(index)}>
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESCRIPCIÓN */}
          <BaseInput
            id="description"
            name="description"
            placeholder="Descripción"
            classs={"inputs normal"}
            inputRef={formRefs.description}
            value={form.description}
            onBlur={handleBlur}
            onChange={handleChange}
            isTextarea
          />

          {/* IMÁGENES */}
          <MultiDropZoneCloudinary
            id="images"
            name="img_url"
            type="file"
            onChange={handleImagesChange}
            setImages={handleSetImages}
            onBlur={handleBlur}
          />
          {/* <MultiDropZone
            id="images"
            name="img_url"
            type="file"
            onChange={handleImagesChange}
            setImages={handleSetImages}
            onBlur={handleBlur}
          /> */}

          {/* BOTÓN */}
          <BaseButton
            disabled={!isFormComplete}
            handleClick={(e) => handleSubmitProduct(e, admin.id)}
            classs={"button primary"}
            $colorbtn={"var(--primary)"}
            $colortextbtnprimary={"var(--light)"}
            $colorbtnhoverprimary={"var(--bg-primary-tr)"}
            $colortextbtnhoverprimary={"var(--light)"}
            textLabel
            label="Añadir producto"
          />
        </form>
      </ProductUpload>
    </section>
  );
};

/* =========================
   STYLES
========================= */
const ProductUpload = styled.section`
  display: grid;
  width: 100%;
  height: fit-content;

  .uploadproducts-form {
    display: grid;
    gap: 15px;
    width: 100%;
    padding: 25px;
    margin: auto;

    @media (max-width: 720px) {
      width: 100%;
      padding: 0;
    }
  }

  .uploadproducts-h2 {
    font-size: 30px;
    display: grid;
    width: fit-content;
  }
  .variants {
    display: grid;
    width: fit-content;
    height: fit-content;
  }
`;
