/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import { initialProductForm, useForm } from '../../../hooks/useForm';
import { useTranslation } from 'react-i18next';
import{ useState, useEffect } from 'react';
import { BaseButton, BaseInput } from '../../../../index';
import { MultiDropZone } from '../../../components/globals/MultiDropZone';

export const CreateProduct = () => {
  const { t } = useTranslation();

  const [isFormComplete, setIsFormComplete] = useState(null);


  const validationsForm = (form, data) => {
  
    let errors = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    let regexPrice = /^(0\.([1-9]\d*|[0-9]))$|^[1-9]\d*(\.\d{1,2})?$/;
    let regexTextArea = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s.,:'"?¡¿!/;%]+$/;
    let regexOnlyNumbers = /^[0-9]+$/;
    let name = document.getElementById("name");
    let description = document.getElementById("description");
    let price = document.getElementById("price");
    let previousPrice = document.getElementById("previousPrice");
    let category = document.getElementById("category");
    let quantity = document.getElementById("quantity");
    let image = document.getElementById("image");
  
  
    if (!form.name) {
      name.style.cssText = "border: red 1px solid;";
      errors.name = "Escribe un nombre de producto";
    } else if (!regexName.test(form.name.trim())) {
      errors.name = "Nombre de producto debe contener solo letras";
    } else {
      name.style.cssText = "border: #34B0BE 1px solid;";
    }
  
    if (!form.description) {
      description.style.cssText = "border: red 1px solid";
      errors.description = "Debes escribir una descripción";
    } else {
      description.style.cssText = "border: #34B0BE 1px solid;";
    }
    if (!form.price) {
      price.style.cssText = "border: red 1px solid";
      errors.price = "Escribe un precio";
    } else if (!regexPrice.test(form.price.trim())) {
      errors.price = "Precio debe contener solo números ej: 0.1";
    } else {
      price.style.cssText = "border: #34B0BE 1px solid;";
    }
    if (!form.previousPrice) {
      previousPrice.style.cssText = "border: red 1px solid";
      errors.previousPrice = "Escribe un precio anterior";
    } else if (!regexPrice.test(form.previousPrice.trim())) {
      errors.previousPrice = "Precio debe contener solo números ej: 0.1";
    } else {
      previousPrice.style.cssText = "border: #34B0BE 1px solid;";
    }
    if (!form.category) {
      category.style.cssText = "border: red 1px solid";
      errors.category = "Escribe una categoría";
    }  else {
      category.style.cssText = "border: #34B0BE 1px solid;";
    }
    if (!form.quantity) {
      quantity.style.cssText = "border: red 1px solid";
      errors.quantity = "Escribe una cantidad";
    } else if (!regexOnlyNumbers.test(form.quantity.trim())) {
      errors.quantity = "Categoría debe contener solo letrass; ";
    } else {
      quantity.style.cssText = "border: #34B0BE 1px solid;";
    }
    
    if (!form.image) {
      image.style.cssText = "border: red 1px solid";
      errors.image = "Selecciona una imagen";
    }  else {
      image.style.cssText = "border: #34B0BE 1px solid;";
    }
    return errors;
  };



  const {
    form,
    errors,
    loading,
    response,
    modal,
    handleChange,
    handleBlur,
    handleSubmitProduct,
    handleSetImages,
    handleImagesChange
  } = useForm(initialProductForm, validationsForm);


  useEffect(() => {
    // Verificar si todos los campos del formulario están llenos
    const isFormFilled = Object.values(form).every(value => value !== "");
    // Actualizar el estado de completitud del formulario
    // console.log("Formulario vacío:", form);
    setIsFormComplete(isFormFilled);
  }, [form]);

  


  return (
    <ProductUpload className="uploadproducts" encType="multipart/form-data" >
      <h2 className="uploadproducts-h2">Agregar producto</h2>
      <form className="uploadproducts-form" encType="multipart/form-data">
        <div>
          <BaseInput 
            id="name" 
            name="name" 
            classs={"inputs outline"}
            placeholder="Nombre del producto"
            value={form.name}
              onBlur={handleBlur}
              onChange={handleChange}
              required 
          />
          {errors.name && <p className="warnings-form">{errors.name}</p>}
        </div>
        <div>
          <BaseInput 
            id="price" 
            name="price" 
            classs={"inputs outline"}
            placeholder="Precio" 
            value={form.price}
              onBlur={handleBlur}
              onChange={handleChange}
              isNumber={true}
              required
          />
          {errors.price && <p className="warnings-form">{errors.price}</p>}
        </div>
        <div>
          <BaseInput 
            id="previousPrice" 
            name="previousPrice" 
            classs={"inputs outline"}
            placeholder="Precio anterior" 
            value={form.previousPrice}
              onBlur={handleBlur}
              onChange={handleChange}
              isNumber={true}
              required
          />
          {errors.previousPrice && <p className="warnings-form">{errors.previousPrice}</p>}
        </div>
        <div>
          <BaseInput 
            id="category" 
            name="category" 
            classs={"inputs outline"}
            placeholder="Categoría" 
            value={form.category}
              onBlur={handleBlur}
              onChange={handleChange}
              required
          />
          {errors.category && <p className="warnings-form">{errors.category}</p>}
        </div>
        <div>
          <BaseInput 
            id="quantity" 
            name="quantity" 
            classs={"inputs outline"}
            placeholder="Cantidad" 
            value={form.quantity}
              onBlur={handleBlur}
              onChange={handleChange}
              required
            isNumber={true}
          />
          {errors.quantity && <p className="warnings-form">{errors.quantity}</p>}
        </div>
        <div>
          <BaseInput 
            id="description" 
            name="description" 
            classs={"inputs outline"}
            placeholder="Descripción" 
            value={form.description}
              onBlur={handleBlur}
              onChange={handleChange}
              required
            isTextarea={true}
          />
          {errors.description && <p className="warnings-form">{errors.description}</p>}
        </div>
        <div>
        <MultiDropZone
              onBlur={handleBlur}
              id="images"
              name="img_url"
              type="file"
              onChange={handleImagesChange}
              setImages={handleSetImages}
              />
            {errors.image && <p className="warnings-form">{errors.image}</p>}
        </div>
        <div>
        <BaseButton 
        disabled={!isFormComplete} 
        handleClick={handleSubmitProduct} 
        classs={'button primary'} 
        colorbtn={"var(--primary)"}
        colortextbtnprimary={"var(--light)"}
        colorbtnhoverprimary={"var(--bg-primary-tr)"}
        colortextbtnhoverprimary={"var(--light)"}
        textLabel={true} 
        label={"Añadir producto"}
        />
        </div>
      </form>
    </ProductUpload>
  )
}

// css del componente con styled components
const ProductUpload = styled.section`
  display: grid;
  width: 100%;
  height: fit-content;

.uploadproducts-form {
  display: grid;
  width: 100%;
  gap: 15px;
  width: 50%;
  padding: 25px;
  margin: auto;
}
.uploadproducts-h2 {
  font-size: 30px;
  display: grid;
  width: fit-content;
  height: fit-content;
}
`;
