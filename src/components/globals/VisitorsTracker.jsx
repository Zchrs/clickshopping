/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

export const VisitorsTracker = () => {
  const browserLocation = useLocation();

  const [geoLocation, setGeoLocation] = useState({
    country: "Cargando...",
    city: "Cargando...",
    flag: "",
    cityImage: "",
    language: navigator.language || "es-ES",
  });

  const [connectedVisitors, setConnectedVisitors] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [pageVisits, setPageVisits] = useState(0);
  const [deviceOs, setDeviceOs] = useState([]);
  const [browsers, setBrowsers] = useState([]);
const [devices, setDevices] = useState([]);

  // Diccionario de imágenes de ciudades (puedes expandirlo)
  const cityImages = {
    Bogotá: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Bogot%C3%A1_skyline_from_Monserrate.jpg/320px-Bogot%C3%A1_skyline_from_Monserrate.jpg",
    Medellín: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Medellin_skyline.jpg/320px-Medellin_skyline.jpg",
    Cali: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Cali_Colombia.jpg/320px-Cali_Colombia.jpg",
    "Buenos Aires": "https://images.unsplash.com/photo-1542698135-218287acbab7?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80",
    "Ciudad de México": "https://images.unsplash.com/photo-1512237798643-271663c23765?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80",
    "São Paulo": "https://images.unsplash.com/photo-1541011461380-0a0e0d8c0e7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80",
    default: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80",
  };

  // Registrar heartbeat (POST) b
useEffect(() => {
  fetchStatsFromBackend();

  const statsInterval = setInterval(fetchStatsFromBackend, 20000);

  return () => clearInterval(statsInterval);
}, []);

  // Obtener estadísticas del backend
  const fetchStatsFromBackend = async () => {
    try {
      const url = import.meta.env.VITE_APP_ADMIN_GET_TURISTS_URL;

      const res = await fetch(`${url}?pathname=${encodeURIComponent(browserLocation.pathname)}`);

      if (!res.ok) {
        const errorText = await res.text().catch(() => "Sin cuerpo de error");
        console.error("[VisitorsTracker] Error en respuesta:", res.status, errorText);
        throw new Error(`Backend respondió ${res.status} - ${errorText}`);
      }

      const data = await res.json();

      // Actualizamos solo lo que venga del backend
      setConnectedVisitors(data.activeCount || data.connectedVisitors || 0);

      // Si el backend devuelve totalVisits y pageVisits → los usamos
      if (data.totalVisits !== undefined) {
        setTotalVisits(data.totalVisits);
      }
      if (data.pageVisits !== undefined) {
        setPageVisits(data.pageVisits);
      }
      if (data.browsers) setBrowsers(data.browsers);
      if (data.byDeviceOs) setDeviceOs(data.byDeviceOs);
    } catch (err) {
      console.error("[VisitorsTracker] Error obteniendo estadísticas:", err);
      // No bloqueamos la UI → mantenemos fallback de localStorage
    }
  };

useEffect(() => {
  const fetchGeo = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      const cc = data.country_code?.toLowerCase() || "xx";
      const flag = `https://flagcdn.com/w320/${cc}.png`;
      const city = data.city || data.region || "Desconocida";
      const cityImg = cityImages[city] || cityImages.default;

      setGeoLocation({
        country: data.country_name || "Desconocido",
        city,
        flag,
        cityImage: cityImg,
        language: data.languages?.split(",")[0] || navigator.language || "es-ES",
      });
    } catch {
      setGeoLocation({
        country: "No disponible",
        city: "No disponible",
        flag: "",
        cityImage: "",
        language: "es-ES",
      });
    }
  };

  fetchGeo();

  // ✅ SOLO backend
  fetchStatsFromBackend();

  const statsInterval = setInterval(fetchStatsFromBackend, 20000);

  return () => {
    clearInterval(statsInterval);
  };
}, [browserLocation.pathname]);

  // Traducciones
  const messages = {
    "es-ES": {
      title: "Actividad en Tiempo Real",
      connected: "Visitantes conectados ahora",
      totalVisits: "Visitas totales al sitio",
      pageVisits: "Visitas a esta página",
      country: "País",
      city: "Ciudad",
      note: "Datos aproximados vía IP • No rastreamos datos personales",
    },
    "en-US": {
      title: "Real-Time Activity",
      connected: "Connected visitors now",
      totalVisits: "Total site visits",
      pageVisits: "Visits to this page",
      country: "Country",
      city: "City",
      note: "Approximate data via IP • We don't track personal data",
    },
  };

  const lang = messages[geoLocation.language] || messages["es-ES"];

  return (
    <TrackerVisitors>
      <div className="tracker">
        <h2 className="tracker-title">{lang.title}</h2>

        <p className="tracker-visitors">
          {lang.connected}: <strong>{connectedVisitors.toLocaleString()}</strong>
        </p>

        <p className="tracker-visitors">
          {lang.totalVisits}: <strong>{totalVisits.toLocaleString()}</strong>
        </p>

        <p className="tracker-visitors">
          {lang.pageVisits}: <strong>{pageVisits.toLocaleString()}</strong>
        </p>
        <p className="tracker-visitors">
          {lang.pageVisits}: <strong>{pageVisits.toLocaleString()}</strong>
        </p>

        {/* Navegadores */}
<div className="tracker-section">
  <h4>Navegadores</h4>
  {browsers.map((b) => (
    <p key={b.browser}>
      {b.browser}: <strong>{b.count}</strong>
    </p>
  ))}
</div>

{/* Dispositivos */}
<div className="tracker-section">
  <h4>Dispositivos</h4>

  {deviceOs.map((d) => (
    <p key={`${d.device}-${d.os}`}>
      {d.device} · {d.os}: <strong>{d.count}</strong>
    </p>
  ))}
</div>

        <div className="tracker-grid">
          <div className="tracker-flex">
  {geoLocation.flag && (
    <img
      src={geoLocation.flag}
      alt={`Bandera de ${geoLocation.country}`}
      className="tracker-flag"
      loading="lazy"
    />
  )}

  <p className="tracker-location">
    <strong>{lang.country}:</strong> {geoLocation.country}
  </p>
</div>

          <div className="tracker-flex">
  {geoLocation.cityImage && (
    <img
      src={geoLocation.cityImage}
      alt={`Vista de ${geoLocation.city}`}
      className="tracker-city-image"
      loading="lazy"
      onError={(e) => (e.target.src = cityImages.default)}
    />
  )}

  <p className="tracker-location">
    <strong>{lang.city}:</strong> {geoLocation.city}
  </p>
</div>
        </div>

        <small className="tracker-note">{lang.note}</small>
      </div>
    </TrackerVisitors>
  );
};

// Estilos iguales, con algunos ajustes para más contenido
const TrackerVisitors = styled.div`


  .tracker {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    padding: 16px 20px;
    width: 100%; // Un poco más ancho para nuevo contenido
    height: 100%;
    font-family: system-ui, -apple-system, sans-serif;
    color: #333;
    text-align: center;

    &-title {
      font-size: 1.3rem;
      margin: 0 0 12px;
      color: #1a1a1a;
      font-weight: 600;
    }

    &-visitors {
      font-size: 1.05rem;
      margin: 6px 0;
      color: #e91e63;
      font-weight: bold;
    }

    &-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
      margin-top: 10px;
    }

    &-flex {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: center;
    }

    &-flag,
    &-city-image {
      width: 36px; // Un poco más grande
      height: auto;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
      object-fit: cover;
    }

    &-location {
      margin: 0;
      font-size: 0.95rem;
      color: #444;
    }

    &-note {
      display: block;
      margin-top: 14px;
      font-size: 0.75rem;
      color: #777;
      font-style: italic; // Para enfatizar privacidad
    }
  }

  @media (max-width: 600px) {
    bottom: 10px;
    right: 10px;
    .tracker {
      width: 240px;
      padding: 12px 16px;
    }
  }
`;