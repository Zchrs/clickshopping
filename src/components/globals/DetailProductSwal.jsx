/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useEffect, useState, useCallback, useMemo } from "react";
import { formatPrice } from "../../../globalActions";
import styled from "styled-components";

/** Convierte hex/nombre CSS a [r, g, b] */
const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
};

/** Distancia euclidiana entre dos colores RGB */
const colorDistance = ([r1, g1, b1], [r2, g2, b2]) =>
  Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);

/** Extrae el color dominante de una imagen via Canvas (ignora fondo blanco/transparente) */
const getDominantColor = (imgSrc) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    const timeoutId = setTimeout(() => {
      resolve([128, 128, 128]);
    }, 5000);
    
    img.onload = () => {
      clearTimeout(timeoutId);
      const canvas = document.createElement("canvas");
      const size = 80;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, size, size);

      const { data } = ctx.getImageData(0, 0, size, size);
      const colorCount = {};

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue;
        if (r > 240 && g > 240 && b > 240) continue;

        const roundedR = Math.round(r / 20) * 20;
        const roundedG = Math.round(g / 20) * 20;
        const roundedB = Math.round(b / 20) * 20;
        const key = `${roundedR},${roundedG},${roundedB}`;
        
        if (!colorCount[key]) {
          colorCount[key] = { count: 0, r: 0, g: 0, b: 0 };
        }
        colorCount[key].count++;
        colorCount[key].r += r;
        colorCount[key].g += g;
        colorCount[key].b += b;
      }

      let maxCount = 0;
      let dominantColor = [128, 128, 128];
      
      Object.values(colorCount).forEach((color) => {
        if (color.count > maxCount) {
          maxCount = color.count;
          dominantColor = [
            Math.round(color.r / color.count),
            Math.round(color.g / color.count),
            Math.round(color.b / color.count),
          ];
        }
      });

      resolve(dominantColor);
    };
    img.onerror = () => {
      clearTimeout(timeoutId);
      resolve([128, 128, 128]);
    };
    img.src = imgSrc;
  });

// ─── Mapa de colores del selector con sus valores RGB exactos ───────────────
const colorMapExact = {
  negro: { hex: "#000000", rgb: [0, 0, 0] },
  blanco: { hex: "#FFFFFF", rgb: [255, 255, 255] },
  rojo: { hex: "#FF0000", rgb: [255, 0, 0] },
  azul: { hex: "#3167b7", rgb: [49, 103, 183] },  // ✅ Corregido: RGB correcto para #3167b7
  azulOscuro: { hex: "#063888", rgb: [6, 56, 136] },
  azulMarino: { hex: "#023b8e", rgb: [2, 59, 142] },
  verde: { hex: "#28A745", rgb: [40, 167, 69] },
  aguamarina: { hex: "#239699", rgb: [35, 150, 153] },
  amarillo: { hex: "#FFC107", rgb: [255, 193, 7] },
  gris: { hex: "#6C757D", rgb: [108, 117, 125] },
  violeta: { hex: "#6d1e87", rgb: [109, 30, 135] },
  morado: { hex: "#6F42C1", rgb: [111, 66, 193] },
  purpura: { hex: "#6F42C1", rgb: [111, 66, 193] },
  rosado: { hex: "#E83E8C", rgb: [232, 62, 140] },
  rosa: { hex: "#E83E8C", rgb: [232, 62, 140] },
  naranja: { hex: "#FD7E14", rgb: [253, 126, 20] },
  dorado: { hex: "#DAA520", rgb: [218, 165, 32] },
  plateado: { hex: "#C0C0C0", rgb: [192, 192, 192] },
  teal: { hex: "#008B8B", rgb: [0, 139, 139] },
  turquesa: { hex: "#40E0D0", rgb: [64, 224, 208] },
  cyan: { hex: "#00FFFF", rgb: [0, 255, 255] },
  cian: { hex: "#00FFFF", rgb: [0, 255, 255] },
  mint: { hex: "#3EB489", rgb: [62, 180, 137] },
  cafe: { hex: "#8B4513", rgb: [139, 69, 19] },
  marron: { hex: "#8B4513", rgb: [139, 69, 19] },
};

// También agregar alias para variaciones de azul
const colorAliases = {
  "azul cielo": "azul",
  "azul claro": "azul",
  "azul rey": "azul",
  "azul electrico": "azul",
  "azul marino": "azulOscuro",
  "azul oscuro": "azulOscuro",
  "navy": "azulOscuro",
};

const normalize = (c) => {
  if (!c) return "";
  let normalized = c.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Verificar si hay alias
  if (colorAliases[normalized]) {
    return colorAliases[normalized];
  }
  return normalized;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export const DetailProductSwal = ({ product, onConfirm }) => {
  const [activeColor, setActiveColor] = useState(null);
  const [activeImage, setActiveImage] = useState(
    product.images?.[0] || product.img_url || ""
  );
  const [colorImageMap, setColorImageMap] = useState({});
  const [mapReady, setMapReady] = useState(false);
  const [processingError, setProcessingError] = useState(false);

  // ── Construir el mapa color→imagen analizando cada imagen ────────────────
  useEffect(() => {
    if (!product.images?.length || !product.colors?.length) {
      setMapReady(true);
      return;
    }

    const buildMap = async () => {
      setProcessingError(false);
      
      // Crear mapa de colores disponibles
      const availableColors = {};
      product.colors.forEach(colorName => {
        const normalized = normalize(colorName);
        let colorData = colorMapExact[normalized];
        
        // Si no encuentra el color exacto, buscar por similitud en las keys
        if (!colorData) {
          const similarKey = Object.keys(colorMapExact).find(key => 
            key.includes(normalized) || normalized.includes(key)
          );
          if (similarKey) {
            colorData = colorMapExact[similarKey];
          }
        }
        
        if (colorData) {
          availableColors[normalized] = {
            name: colorName,
            rgb: colorData.rgb,
            hex: colorData.hex
          };
        } else {
          // Si el color no está en el mapa, usar un valor por defecto
          availableColors[normalized] = {
            name: colorName,
            rgb: [128, 128, 128],
            hex: "#888888"
          };
        }
      });

      const map = {};
      const usedImages = new Set();

      // Para cada imagen, encontrar el color más cercano
      const imagePromises = product.images.map(async (imgSrc, index) => {
        try {
          const dominantRgb = await getDominantColor(imgSrc);
          
          // Encontrar el color más cercano en availableColors
          let bestColor = null;
          let bestDistance = Infinity;

          for (const [colorKey, colorValue] of Object.entries(availableColors)) {
            const distance = colorDistance(dominantRgb, colorValue.rgb);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestColor = colorKey;
            }
          }

          // Umbral más permisivo para el azul
          const THRESHOLD = bestColor?.includes("azul") ? 150 : 100;
          
          if (bestColor && bestDistance < THRESHOLD) {
            return { bestColor, imgSrc };
          }
        } catch (err) {
          console.warn(`Error procesando imagen ${index}:`, err);
        }
        return null;
      });

      const results = await Promise.all(imagePromises);
      
      // Asignar resultados al mapa
      for (const result of results) {
        if (result && !map[result.bestColor]) {
          map[result.bestColor] = result.imgSrc;
          usedImages.add(result.imgSrc);
        }
      }

      // Si hay colores sin imagen asignada, asignar por orden
      if (product.colors.length > 0 && Object.keys(map).length < product.colors.length) {
        let imageIndex = 0;
        for (const colorName of product.colors) {
          const normalized = normalize(colorName);
          if (!map[normalized] && product.images[imageIndex]) {
            map[normalized] = product.images[imageIndex];
            imageIndex++;
          }
        }
      }

      setColorImageMap(map);
      setMapReady(true);
      
      // Log para debugging
      console.log("Color-Image Map:", map);
      console.log("Available colors:", availableColors);
    };

    buildMap();
  }, [product]);

  // ── Inicializar selección ────────────────────────────────────────────────
  useEffect(() => {
    if (product.images?.length) setActiveImage(product.images[0]);
    if (product.colors?.length) {
      setActiveColor(product.colors[0]);
      // Intentar encontrar la imagen para el primer color
      const firstColorNorm = normalize(product.colors[0]);
      if (colorImageMap[firstColorNorm]) {
        setActiveImage(colorImageMap[firstColorNorm]);
      }
    }
  }, [product, colorImageMap]);

  // ── Al cambiar color → buscar imagen en el mapa ──────────────────────────
  useEffect(() => {
    if (!activeColor || !mapReady) return;

    const key = normalize(activeColor);
    let mapped = colorImageMap[key];

    // Si no encuentra, buscar por similitud
    if (!mapped) {
      const similarKey = Object.keys(colorImageMap).find(k => 
        k.includes(key) || key.includes(k)
      );
      if (similarKey) {
        mapped = colorImageMap[similarKey];
      }
    }

    if (mapped) {
      setActiveImage(mapped);
    }
  }, [activeColor, colorImageMap, mapReady]);

  const handleSelectColor = (color) => {
    setActiveColor(color);
  };

  const handleImageClick = (img) => {
    setActiveImage(img);
    // Buscar qué color está asociado a esta imagen
    const matchedColorEntry = Object.entries(colorImageMap).find(
      ([, mappedImg]) => mappedImg === img
    );
    if (matchedColorEntry) {
      const matchedColorKey = matchedColorEntry[0];
      const originalColor = product.colors?.find(
        c => normalize(c) === matchedColorKey
      );
      if (originalColor) setActiveColor(originalColor);
    }
  };

  return (
    <DetailSwal>
      <div className="detailswal">
        <div className="detailswal-container">
          {/* IMAGEN PRINCIPAL */}
          <div className="detailswal-right">
            <img
              loading="lazy"
              src={activeImage}
              alt={product.name}
              style={{
                height: "350px",
                objectFit: "contain",
                borderRadius: "10px",
              }}
              onError={(e) => {
                e.target.src = "/img/no-image.png";
              }}
            />

            {/* Miniaturas */}
            <div className="flex-s">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => handleImageClick(img)}
                  loading="lazy"
                  style={{
                    width: 55,
                    height: 55,
                    objectFit: "cover",
                    borderRadius: 6,
                    cursor: "pointer",
                    border:
                      activeImage === img
                        ? "2px solid #000"
                        : "1px solid #ddd",
                  }}
                  onError={(e) => {
                    e.target.src = "/img/no-image.png";
                  }}
                />
              ))}
            </div>
          </div>

          {/* INFORMACIÓN */}
          <div className="detailswal-left">
            <div className="detailswal-info">
              <div>
                <h3>{product.name}</h3>
                <h2 style={{ color: "#28a745" }}>
                  ${formatPrice(product.price)}
                </h2>
              </div>

              <p className="detailswal-description">{product.description}</p>

              {/* COLORES */}
              <div className="detailswal-infocolors">
                <p>Selecciona un color</p>
                <div className="detailswal-colors">
                  {product.colors?.map((color, i) => {
                    const normalized = normalize(color);
                    let colorData = colorMapExact[normalized];
                    
                    // Buscar color similar si no existe
                    if (!colorData) {
                      const similarKey = Object.keys(colorMapExact).find(key => 
                        key.includes(normalized) || normalized.includes(key)
                      );
                      if (similarKey) {
                        colorData = colorMapExact[similarKey];
                      }
                    }
                    
                    const bg = colorData?.hex || "#888888";
                    const isActive = normalize(activeColor) === normalized;
                    const hasImage = !!colorImageMap[normalized];

                    return (
                      <div
                        key={i}
                        onClick={() => hasImage && handleSelectColor(color)}
                        style={{
                          width: 35,
                          height: 35,
                          borderRadius: "50%",
                          background: bg,
                          cursor: hasImage ? "pointer" : "not-allowed",
                          border: isActive ? "3px solid #000" : "1px solid #ccc",
                          transform: isActive ? "scale(1.15)" : "scale(1)",
                          transition: "all 0.2s",
                          opacity: hasImage ? 1 : 0.5,
                          position: "relative",
                        }}
                        title={hasImage ? color : `${color} (sin imagen)`}
                      >
                        {!hasImage && (
                          <span style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            background: "#ff4444",
                            color: "white",
                            borderRadius: "50%",
                            width: "16px",
                            height: "16px",
                            fontSize: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            !
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!mapReady && (
                  <p style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
                    Cargando colores...
                  </p>
                )}
              </div>

              <button
                className="detailswal-btn"
                onClick={() => onConfirm(activeColor)}
                disabled={!activeColor || !mapReady}
              >
                {!activeColor 
                  ? "Selecciona un color" 
                  : !mapReady 
                    ? "Cargando..." 
                    : "Agregar al carrito"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </DetailSwal>
  );
};


const DetailSwal = styled.div`
  .detailswal {
    display: grid;
    width: 100%;
    height: 100%;

    &-container {
      display: grid;
      gap: 20px;
      grid-template-columns: 50% 1fr;

      @media (max-width: 620px) {
        grid-template-columns: 1fr;
      }
    }

    &-description {
      font-size: 16px;
      word-break: break-all;
      margin: auto;
      width: 100%;
    }

    &-infocolors {
      display: grid;
      gap: 5px;

      p {
        font-size: 13px;
        font-weight: 500;
      }
    }

    &-right {
      display: grid;
      width: fit-content;
      gap: 10px;
    }

    &-left {
      width: 100%;
      height: 100%;
      display: grid;
      gap: 20px;
      align-items: center;
    }

    &-colors{
       display: flex; 
       gap: 10px; 
    }
    &-info{
      display: grid;
      text-align: left;
      gap: 15px;
    }

    &-btn {
      display: grid;
      background: var(--primary);
      transition: all ease 0.5s;
      padding: 10px;
      color: white;
      outline: none;
      border: none;
      border-radius: 8px;

      &:hover {
        background: var(--primary-semi);
      }
    }
  }
`;