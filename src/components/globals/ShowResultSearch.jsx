/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPropertiesByFilter,
  selectedProperty,
  setPropertiesFiltered,
} from "../actions/propertyActions";
import { useEffect, useState } from "react";
import { CardLeases } from "./CardLeases";
import styled from "styled-components";

export const ShowResultSearch = ({ filters }) => {
  const dispatch = useDispatch();
  const filteredProperties = useSelector((state) => state.properties.filtered);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const getProperties = async () => {
    setLoading(true);
    try {
      if (filters && Object.keys(filters).length > 0) {
        const results = await dispatch(fetchPropertiesByFilter(filters));
        
        if (results.length === 0) {
          // Mostrar mensaje específico cuando no hay resultados
          dispatch(setPropertiesFiltered([]));
        }
      } else {
        dispatch(setPropertiesFiltered([]));
      }
    } catch (error) {
      console.error("Error al buscar propiedades:", error);
      dispatch(setPropertiesFiltered([]));
    } finally {
      setLoading(false);
    }
  };

  getProperties();
}, [filters, dispatch]);

    const handleSetProductClick = (property) => {
      dispatch(selectedProperty(property));
    };

  return (
    <Filter>
    <div className="results-container">
      {loading ? (
        <p>Cargando propiedades...</p>
      ) : filteredProperties.length > 0 ? (
        filteredProperties.map((property) => (
          <CardLeases
            key={property.id}
            quantityBathrooms={property.bathRoom}
            quantityCloset={property.closets}
            quantityRooms={property.bedRoom}
            location={property.district || "Ubicación no disponible"}
            productLink={`/properties/${property.id}`}
            addToWish="addwishlist-red"
            img={property.image || "/default-property.jpg"}
            sellingsText={true}
            priceText={true}
            price={property.price || "Consultar"}
            productInfo={property}
            boxFlex={true}
            classs="productcard background"
            onClick={() => handleSetProductClick(property)}
            prodHover={() => handleSetProductClick(property)}
            jpg="true"
            title={property.title || "Propiedad sin título"}
            thumbnails={property.images || []}
            showToAddWish={true}
            property_id={property.id}
            propertyRef={property.ref}
          />
        ))
      ) : (
        <p className="results-container-p">No se encontraron propiedades con los filtros seleccionados.</p>
      )}
    </div>
    </Filter>
  );
};

const Filter = styled.div`
.results-container{
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  align-items: center;

  &-p{
    display: grid;
    grid-column: 1 / 5;
  }
}
`
