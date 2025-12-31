/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import axios from "axios";
import { types } from "../types/types";
import { io } from "socket.io-client";


export const setProperty = (propertyInfo) => {
    return {
      type: types.propertyView,
      payload: Array.isArray(propertyInfo) ? propertyInfo : [],
    };
  };

export const setPropertiesFiltered = (filtered) => {
    return {
      type: types.setFilteredProperties,
      payload: Array.isArray(filtered) ? filtered : [],
    };
  };

export const clearProperty = (propertyInfo) => {
    return {
      type: types.REMOVE_PROPERTY,
      payload: Array.isArray(propertyInfo) ? propertyInfo : [],
    };
  };

  export const storagedProperty = (propertyInfo) => ({
    type: types.STORAGED_PROPERTY,
    payload: Array.isArray(propertyInfo) ? propertyInfo : [],
  });
  
  export const selectedProperty = (propertyInfo) => ({
    type: types.SELECTED_PROPERTY,
    payload: propertyInfo,
  });
  
  export const updateProperty = (propertyInfo) => ({
    type: types.UPDATE_PROPERTY,
    payload: Array.isArray(propertyInfo) ? propertyInfo : [],
  });

  export const setRatings = (ratings) => ({
    type: types.SET_RATINGS,
    payload: ratings,
  });


  export const moveFromPropertiesToRented = (productId) => async (dispatch, getState) => {
    // const { id: userId } = getState().auth.user;
  
    try {
      // Llamada a la API para mover el producto del carrito a la lista de deseos
      await axios.post(`${import.meta.env.VITE_APP_API_MOVE_TO_RENTED_URL}/${productId}`, {
        // user_id: userId,
        product_id: productId
      });
  
      // Despachar la acción para actualizar el estado en Redux
      dispatch({
        type: types.MOVE_FROM_PROPERTIES_TO_RENTED,
        payload: productId,
      });
    } catch (error) {
      console.error('Error al mover el inmueble a propiedades vendidas:', error);
    }
  };
  export const moveFromPropertiesToSold = (productId) => async (dispatch, getState) => {
    // const { id: userId } = getState().auth.user;
  
    try {
      // Llamada a la API para mover el producto del carrito a la lista de deseos
      await axios.post(`${import.meta.env.VITE_APP_API_MOVE_TO_SOLD_URL}/${productId}`, {
        // user_id: userId,
        product_id: productId
      });
  
      // Despachar la acción para actualizar el estado en Redux
      dispatch({
        type: types.MOVE_FROM_SELL_TO_SOLD,
        payload: productId,
      });
    } catch (error) {
      console.error('Error al mover el inmueble a propiedades vendidas:', error);
    }
  };


  export const fetchSellProperties = (action) => async (dispatch) => {

    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_GET_SELL_PROPERTIES_URL}/${action}`);
      const propertiesComplete = await Promise.all(response.data.map(async (propertyInfo) => {
        try {
          const imagesRes = await axios.get(`${import.meta.env.VITE_APP_API_GET_IMAGES_PROPERTIES_URL}/${propertyInfo.id}`);
          return {
            ...propertyInfo,
            images: imagesRes.data.images || [],
          };
        } catch (error) {
          console.error(`Error al obtener las imágenes para el inmueble ${propertyInfo.id}:`, error);
          return {
            ...propertyInfo,
            images: [],
          };
        }
      }));
      localStorage.setItem('leasesProperties', JSON.stringify(propertiesComplete));
      dispatch(setProperty(propertiesComplete));
    } catch (error) {
      console.error('Error al obtener las propiedades vendidas:', error);
      dispatch(setProperty([])); // Asegurarse de despachar un array vacío en caso de error
    }
  };
  export const fetchSoldProperties = (action) => async (dispatch) => {

    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_GET_SOLD_PROPERTIES_URL}/${action}`);
      const propertiesComplete = await Promise.all(response.data.map(async (propertyInfo) => {
        try {
          const imagesRes = await axios.get(`${import.meta.env.VITE_APP_API_GET_IMAGES_PROPERTIES_URL}/${propertyInfo.id}`);
          return {
            ...propertyInfo,
            images: imagesRes.data.images || [],
          };
        } catch (error) {
          console.error(`Error al obtener las imágenes para el inmueble${propertyInfo.id}:`, error);
          return {
            ...propertyInfo,
            images: [],
          };
        }
      }));
      dispatch(setProperty(propertiesComplete));
    } catch (error) {
      console.error('Error al obtener los inmuebles vendidos:', error);
      dispatch(setProperty([])); // Asegurarse de despachar un array vacío en caso de error
    }
  };

  export const fetchRentedProperties = (action) => async (dispatch) => {

    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_GET_RENTED_PROPERTIES_URL}/${action}`);
      const propertiesComplete = await Promise.all(response.data.map(async (propertyInfo) => {
        try {
          const imagesRes = await axios.get(`${import.meta.env.VITE_APP_API_GET_IMAGES_PROPERTIES_URL}/${propertyInfo.id}`);
          return {
            ...propertyInfo,
            images: imagesRes.data.images || [],
          };
        } catch (error) {
          console.error(`Error al obtener las imágenes para el inmueble${propertyInfo.id}:`, error);
          return {
            ...propertyInfo,
            images: [],
          };
        }
      }));
      dispatch(setProperty(propertiesComplete));
    } catch (error) {
      console.error('Error al obtener las propiedades arrendadas:', error);
      dispatch(setProperty([])); // Asegurarse de despachar un array vacío en caso de error
    }
  };
  // export const fetchRentProperties = (action) => async (dispatch) => {

  //   try {
  //     const response = await axios.get(`${import.meta.env.VITE_APP_API_GET_RENT_PROPERTIES_URL}/${action}`);
  //     const propertiesComplete = await Promise.all(response.data.map(async (propertyInfo) => {
  //       try {
  //         const imagesRes = await axios.get(`${import.meta.env.VITE_APP_API_GET_IMAGES_PROPERTIES_URL}/${propertyInfo.id}`);
  //         return {
  //           ...propertyInfo,
  //           images: imagesRes.data.images || [],
  //         };
  //       } catch (error) {
  //         console.error(`Error al obtener las imágenes para el inmueble${propertyInfo.id}:`, error);
  //         return {
  //           ...propertyInfo,
  //           images: [],
  //         };
  //       }
  //     }));
  //     localStorage.setItem('rentProperties', JSON.stringify(propertiesComplete));
  //     dispatch(setProperty(propertiesComplete));
  //   } catch (error) {
  //     console.error('Error al obtener los inmuebles arrendados:', error);
  //     dispatch(setProperty([])); // Asegurarse de despachar un array vacío en caso de error
  //   }
  // };

  export const fetchRentProperties = (action) => async (dispatch) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_GET_RENT_PROPERTIES_URL}/${action}`);
      const propertiesComplete = await Promise.all(response.data.map(async (propertyInfo) => {
        try {
          const imagesRes = await axios.get(`${import.meta.env.VITE_APP_API_GET_IMAGES_PROPERTIES_URL}/${propertyInfo.id}`);
          return {
            ...propertyInfo,
            images: imagesRes.data.images || [],
          };
        } catch (error) {
          console.error(`Error al obtener las imágenes para el inmueble ${propertyInfo.id}:`, error);
          return {
            ...propertyInfo,
            images: [],
          };
        }
      }));
      localStorage.setItem('leasesProperties', JSON.stringify(propertiesComplete));
      dispatch(setProperty(propertiesComplete));
    } catch (error) {
      console.error('Error al obtener las propiedades arrendadas:', error);
      dispatch(setProperty([])); // Asegurarse de despachar un array vacío en caso de error
    }
};

  export const fetchProperties = () => async (dispatch) => {
    try {

        // Consultar la base de datos si no hay productos en localStorage o si el array está vacío
        const response = await axios.get(import.meta.env.VITE_APP_API_GET_PROPERTIES_URL);
        const propertiesComplete = await Promise.all(response.data.map(async (propertyInfo) => {
            const imagesRes = await axios.get(`${import.meta.env.VITE_APP_API_GET_IMAGES_PROPERTIES_URL}/${propertyInfo.id}`);
            return {
                ...propertyInfo,
                images: imagesRes.data.images || [],
            };
        }));

        // Guardar los productos en localStorage después de la consulta
        localStorage.setItem('properties', JSON.stringify(propertiesComplete));
        dispatch(setProperty(propertiesComplete));
        return propertiesComplete;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        dispatch(setProperty([])); // Asegurarse de despachar un array vacío en caso de error
        throw error;
    }
};

export const fetchPropertiesByFilter = (filters = {}) => async (dispatch) => {
  try {
    // Limpiar y mapear correctamente los filtros
    const cleanFilters = {
      ...(filters.sector && { sector: filters.sector }),
      ...(filters.type && { type: filters.type }),
      ...(filters.action && { action: filters.action }),
      ...(filters.budget && { budget: filters.budget }),
      ...(filters.ref && { ref: filters.ref }),
    };

    const params = new URLSearchParams(cleanFilters).toString();
    const url = `${import.meta.env.VITE_APP_API_GET_PROPERTIES_BY_FILTERS_URL}?${params}`;

    const response = await axios.get(url);
    
    const propertiesComplete = await Promise.all(
  response.data.results.map(async (filtered) => {
    const imagesRes = await axios.get(
      `${import.meta.env.VITE_APP_API_GET_IMAGES_PROPERTIES_URL}/${filtered.id}`
    );
    return {
      ...filtered,
      images: imagesRes.data.images || [],
    };
  })
);

    dispatch(setPropertiesFiltered(propertiesComplete));
    return propertiesComplete;
  } catch (error) {
    console.error("Error al obtener las propiedades filtradas:", error);
    dispatch(setPropertiesFiltered([]));
    throw error;
  }
};

export const fetchRecentProperties = () => async (dispatch) => {
  try {
    // 1. Verificar si hay datos en localStorage
    const storedProperties = localStorage.getItem('properties');
    
    // 2. Si hay datos y no están vacíos, usarlos
    if (storedProperties) {
      const parsedProperties = JSON.parse(storedProperties);
      if (Array.isArray(parsedProperties) && parsedProperties.length > 0) {
        dispatch(setProperty(parsedProperties));
        return parsedProperties;
      }
    }

    // 3. Si no hay datos válidos en localStorage, consultar la API
    const response = await axios.get(import.meta.env.VITE_APP_API_GET_RECENT_PROPERTIES_URL);
    
    // 4. Obtener imágenes para cada propiedad
    const propertiesComplete = await Promise.all(
      response.data.map(async (propertyInfo) => {
        try {
          const imagesRes = await axios.get(
            `${import.meta.env.VITE_APP_API_GET_IMAGES_PROPERTIES_URL}/${propertyInfo.id}`
          );
          return {
            ...propertyInfo,
            images: imagesRes.data?.images || [],
          };
        } catch (imageError) {
          console.error(`Error obteniendo imágenes para propiedad ${propertyInfo.id}:`, imageError);
          return {
            ...propertyInfo,
            images: [],
          };
        }
      })
    );

    // 5. Filtrar propiedades sin imágenes si es necesario (opcional)
    // const propertiesWithImages = propertiesComplete.filter(prop => prop.images.length > 0);

    // 6. Guardar en localStorage y actualizar el estado
    // localStorage.setItem('properties', JSON.stringify(propertiesComplete));
    dispatch(setProperty(propertiesComplete));
    
    return propertiesComplete;
  } catch (error) {
    console.error('Error al obtener propiedades recientes:', error);
    
    // Intentar devolver datos de localStorage incluso si hay error en la API
    const fallbackProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    dispatch(setProperty(fallbackProperties));
    
    throw error;
  }
};


  // Función para escuchar actualizaciones de productos y actualizar localStorage
  export const listenForPropertyUpdates = () => (dispatch) => {
    const socket = io(import.meta.env.VITE_APP_API_WEBSOCKET_URL, {
      cors: true,
    });
  
    socket.on('connect', () => {
      console.log('Conectado al servidor de WebSocket');
    });
  
    socket.on('updateProperties', (updatedProperties) => {
      console.log('Productos actualizados:', updatedProperties);
      // Actualizar productos en el estado y localStorage
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      dispatch(setProperty(updatedProperties));
    });
  
    return () => {
      socket.disconnect();
    };
  };
  
  export const fetchPropertiesCategory = (category) => async (dispatch) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_GET_PROPERTIES_CATEGORY}?category=${category}`);
      const propertiesComplete = await Promise.all(response.data.map(async (propertyInfo) => {
        try {
          const imagesRes = await axios.get(`${import.meta.env.VITE_APP_API_GET_IMAGE_PROPERTIES_URL}/${propertyInfo.id}`);
          return {
            ...propertyInfo,
            images: imagesRes.data.images || [],
          };
        } catch (error) {
          console.error(`Error al obtener las imágenes para el producto ${propertyInfo.id}:`, error);
          return {
            ...propertyInfo,
            images: [],
          };
        }
      }));
      dispatch(setProperty(propertiesComplete));
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      dispatch(setProperty([])); // Asegurarse de despachar un array vacío en caso de error
    }
  };
  export const fetchPropertiesAction = (action) => async (dispatch) => {

    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_GET_PROPERTIES_ACTIONS_URL}/${action}`);
      const propertiesComplete = await Promise.all(response.data.map(async (propertyInfo) => {
        try {
          const imagesRes = await axios.get(`${import.meta.env.VITE_APP_API_GET_IMAGES_PROPERTIES_URL}/${propertyInfo.id}`);
          return {
            ...propertyInfo,
            images: imagesRes.data.images || [],
          };
        } catch (error) {
          console.error(`Error al obtener las imágenes para el producto ${propertyInfo.id}:`, error);
          return {
            ...propertyInfo,
            images: [],
          };
        }
      }));
      dispatch(setProperty(propertiesComplete));
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      dispatch(setProperty([])); // Asegurarse de despachar un array vacío en caso de error
    }
  };
  

  export const fetchPropertiesById = (id) => async (dispatch) => {
    try {
      // Fetch product details by ID
      const response = await axios.get(`${import.meta.env.VITE_APP_API_GET_PROPERTY_URL}/${id}`);
      const propertyInfo = response.data;
  
      try {
        // Fetch product images by ID
        const imagesRes = await axios.get(`${import.meta.env.VITE_APP_API_GET_IMAGE_PROPERTIES_URL}/${id}`);
        const productWithImages = {
          ...propertyInfo,
          images: imagesRes.data.images || [],
        };
  
        // Dispatch action to update product in Redux store
        dispatch(setProperty([productWithImages]));
      } catch (error) {
        console.error(`Error al obtener las imágenes para el producto ${id}:`, error);
  
        // Dispatch action to update product without images in case of error
        const productWithoutImages = {
          ...propertyInfo,
          images: [],
        };
        dispatch(setProperty([productWithoutImages]));
      }
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${id}:`, error);
      dispatch(setProperty([])); // Asegurarse de despachar un array vacío en caso de error
    }
  };

  export const addRating = async (productId, userId, rating) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_ADD_RATING_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, user_id: userId, rating }), // Aquí asegúrate de enviar product_id y user_id
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log(data.message);
      return data;
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  };
  
  export const fetchPropertiesRatings = (productIds) => async (dispatch) => {
    try {
      const responses = await Promise.all(
        productIds.map((id) => axios.get(`${import.meta.env.VITE_APP_API_GET_RATING_URL}/${id}`))
      );
  
      const ratings = responses.reduce((acc, response, index) => {
        const productId = productIds[index];
        acc[productId] = response.data;
        return acc;
      }, {});
  
      dispatch(setRatings(ratings));
    } catch (error) {
      console.error('Error fetching product ratings:', error);
    }
  };