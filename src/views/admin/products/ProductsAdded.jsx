/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backward, BaseButton, BaseInput, CardProductsAdmin, MultiDropZone } from "../../../../index";

import { clearProduct, setProduct } from '../../../actions/productActions';
import { useForm } from '../../../hooks/useForm';
import { useValidations } from "../../../hooks/useValidations";
import { useProductsSSE } from '../../../hooks/useProductsSSE';

const initialForm = {
  id: "",
  name: "",
  price: "",
  previousPrice: "",
  category: "",
  quantity: "",
  description: "",
  img_url: [],
};

export const ProductsAdded = ({ 
  item
 }) => {
  const dispatch = useDispatch();
  const [isFormComplete, setIsFormComplete] = useState(false);
  const products = useSelector((state) => state.product.productInfo);
  const [showModal, setShowModal] = useState(false);
  const [selProduct, setSelProduct] = useState(null);
const { formRefs, validateForm } = useValidations();

useProductsSSE();

  const {
      form,
      setForm,
      deleteProduct,
      handleChangeProduct,
      setLoading,
      handleBlur,
      handleImageChange,
      handleUpdateProduct,
      handleSetImage,
      loading,
  } = useForm(initialForm);


 


  useEffect(() => {
      const isFormFilled = Object.values(form).every(value => value !== '');
      setIsFormComplete(isFormFilled);
  }, [form]);

  
  const handleClearProduct = (item) => {
      localStorage.removeItem("item", JSON.stringify(item));
      dispatch(clearProduct(item));
  };

  const handleUpdate = (product) => {
      const update = document.getElementById("update-content");
      const card = document.getElementById("card-products");

      update.style.cssText = `
          transition: all ease .5s;
          transform: translateX(50%);
          opacity: 1;
      `;
      card.style.cssText = `
          transition: all ease .5s;
          transform: translateX(-100%);
          opacity: 0;
      `;

      dispatch(setProduct(product));
      setSelProduct(product);
      console.log(product.id, 'desde handle update')
      setForm({
  id: product.id ?? "",
  name: product.name ?? "",
  price: product.price ?? "",
  previousPrice: product.previousPrice ?? "",
  category: product.category ?? "",
  quantity: product.quantity ?? "",
  description: product.description ?? "",
  img_url: product.images ?? [],
});
  };

  const handleBackward = () => {
      const update = document.getElementById("update-content");
      const card = document.getElementById("card-products");

      update.style.cssText = `
          transition: all ease .5s;
          transform: translateX(300%);
          opacity: 0;
      `;
      card.style.cssText = `
          transition: all ease .5s;
          transform: translateX(0%);
          opacity: 1;
      `;

      handleClearProduct(item);
  };

  return (
      <ProductAdded className='sections'>
          <div className="productsadded">
              <div id='card-products' className="productsadded-container">
                  <h1 className='productsadded-h2'>Productos agregados</h1>
                  <div className="productsadded-contain">
                      {loading ? (
                          <p>Cargando productos...</p>
                      ) : !Array.isArray(products) || products.length === 0 ? (
                          <p>No hay productos disponibles.</p>
                      ) : (
                          products.map((item) => (
                              <CardProductsAdmin
                                  key={item.id}
                                  id={item.id}
                                  productInfo={item}
                                  addToWish={"addwishlist-red"}
                                  addTocart={"addcart-red"}
                                  img={item.images?.[0]}  // ✅ imagen principal
                                  images={item.images}     
                                  description={item.description}
                                  quantity={item.quantity}
                                  title={item.name}
                                  price={item.price}
                                  previousPrice={item.previousPrice}
                                  discount="10%"
                                  uptBtn={true}
                                  delBtn={true}
                                  onUpdate={() => handleUpdate(item)}
                                  onDelete={() => deleteProduct(item)}
                                  classs={"productcard background"}
                              />
                          ))
                      )}
                  </div>
              </div>
              <div id='update-content' className="productsadded-update">
                  <div className="productsadded-update-back">
                      <Backward onClick={handleBackward} />
                  </div>
                  <div>
                      <div className="updateselectedProduct">
                          <h2 className="updateselectedProduct-h2">Actualizar producto</h2>
                          <p className="updateselectedProduct-h3">
                              Detalle a actualizar de: <strong>{selProduct?.name || ''}</strong> <br />
                              con id de producto: <strong>{selProduct?.id || ''}</strong>
                          </p>
                          <form 
                              encType='multipart/form-data'
                              className="updateselectedProduct-form" 
                              onSubmit={(e) => {
                                  e.preventDefault();
                                  handleUpdateProduct(selProduct?.id || '');
                              }}
                          >
                              <div>
                                  <BaseInput
                                      id="name"
                                      name="name"
                                      classs={'inputs outline'}
                                      placeholder="Nombre del producto"
                                      formRefs={form.name}
                                      value={form.name}
                                      onChange={handleChangeProduct}
                                      />
                              </div>
                              <div>
                                  <BaseInput
                                      id="price"
                                      name="price"
                                      classs={'inputs outline'}
                                      placeholder="Precio"
                                      formRefs={form.price}
                                      value={form.price}
                                      onChange={handleChangeProduct}
                                      isNumber={true}
                                      />
                              </div>
                              <div>
                                  <BaseInput
                                      id="previousPrice"
                                      name="previousPrice"
                                      classs={'inputs outline'}
                                      placeholder="Precio anterior"
                                      formRefs={form.previousPrice}
                                      value={form.previousPrice}
                                      onChange={handleChangeProduct}
                                      isNumber={true}
                                      />
                              </div>
                              <div>
                                  <BaseInput
                                      id="category"
                                      name="category"
                                      classs={'inputs outline'}
                                      placeholder="Categoría"
                                      formRefs={form.category}
                                      value={form.category}
                                      onChange={handleChangeProduct}
                                      />
                              </div>
                              <div>
                                  <BaseInput
                                      id="quantity"
                                      name="quantity"
                                      classs={'inputs outline'}
                                      placeholder="Cantidad"
                                      formRefs={form.quantity}
                                      value={form.quantity}
                                      onChange={handleChangeProduct}
                                      isNumber={true}
                                      />
                              </div>
                              <div>
                                  <BaseInput
                                      id="description"
                                      name="description"
                                      classs={'inputs outline'}
                                      placeholder="Descripción"
                                      formRefs={form.description}
                                      value={form.description}
                                      onChange={handleChangeProduct}
                                      isTextarea={true}
                                  />
                              </div>
                              <div>
                                  <MultiDropZone
                                      onBlur={handleBlur}
                                      id="img_url"
                                      name="img_url"
                                      type="file"
                                      onChange={handleImageChange}
                                      setImages={handleSetImage}
                                  />
                              </div>
                              <div>
                                  <BaseButton
                                      type="submit"
                                      classs={'button primary'}
                                                    $colorbtn={"var(--primary)"}
              $colortextbtnprimary={"var(--light)"}
              $colorbtnhoverprimary={"var(--bg-primary-tr)"}
              $colortextbtnhoverprimary={"var(--light)"}
                                      textLabel={true}
                                      label={'Actualizar producto'}
                                      disabled={!isFormComplete || loading}
                                      handleClick={() => handleUpdateProduct(selProduct?.id || '')}
                                  />
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </ProductAdded>
  );
};

const ProductAdded = styled.section`
display: grid;

.productsadded{
  position: relative;
  align-items: start;
  display: grid;
  padding: 25px 0;
 
  min-height: 100vh;
  overflow: hidden;
  overflow-y: scroll;

  &-container{
    display: grid;
  }

  &-contain {
    display: flex;
    flex-wrap: wrap;
    background: white;
    width: fit-content;
    gap: 15px;
    height: fit-content;
    padding: 25px;
    border-radius: 0px 0px 10px 10px ;
  }
  &-h2 {
    font-size: 30px;
    display: grid;
    width: fit-content;
    height: fit-content;
  }
  &-update{
    transform: translateX(200%);
    position: absolute;
    display: grid;
    opacity: 0;
    &-back{
      position: absolute;
      width: 20px;
      height: 20px;
      left: -205px;
    }
    form{
      display: grid;
      gap: 10px;
    }
  }
  
}
`;