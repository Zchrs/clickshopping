/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getFile } from "../../../globalActions";

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

export const VideoModal = ({ videoSrc, forceOpen = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  const videoRef = useRef(null);
  const hasShownThisSession = useRef(false);

  /* =========================
     Abrir solo una vez por sesión
  ========================= */
  useEffect(() => {
    if (hasShownThisSession.current) return;

    const lastSeen = localStorage.getItem("promo_last_seen");
    const now = Date.now();

    const shouldOpen =
      forceOpen ||
      !lastSeen ||
      now - Number(lastSeen) >= TWELVE_HOURS;

    if (shouldOpen) {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
      hasShownThisSession.current = true;
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [forceOpen]);

  /* =========================
     Bloquear ESC
  ========================= */
  useEffect(() => {
    const blockEsc = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", blockEsc, true);
    return () => window.removeEventListener("keydown", blockEsc, true);
  }, []);

  /* =========================
     Detectar fin REAL del video
  ========================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpen) return;

const handleEnded = () => {
  setCanClose(true);

  // Primero aparece el CTA
  setTimeout(() => {
    setShowCTA(true);
  }, 400);

  // Después aparece el botón
  setTimeout(() => {
    setShowClose(true);
  }, 1400); // 1 segundo después del CTA
};
    

    video.addEventListener("ended", handleEnded);

    video.play().catch(() => {
      console.warn("Autoplay bloqueado");
    });

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [isOpen]);

  useEffect(() => {
  if (!videoSrc) return;

  const preloadVideo = document.createElement("video");
  preloadVideo.src = getFile("video", videoSrc, "mp4");
  preloadVideo.preload = "auto";
  preloadVideo.muted = true;

  // Fuerza descarga
  preloadVideo.load();
}, [videoSrc]);

  const handleClose = () => {
    if (!canClose) return;

    localStorage.setItem("promo_last_seen", Date.now().toString());
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <CinematicBars />

      <ModalContainer>
        <StyledVideo
          ref={videoRef}
          src={getFile("video", videoSrc, "mp4")}
          muted
          playsInline
          preload="auto"
        />

        <CTA $visible={showCTA}>
          ¡DISPONIBLE AHORA EN CLICKSHOPPING!
        </CTA>

        <CloseButton visible={showClose} onClick={handleClose}>
          CONTINUAR
        </CloseButton>
      </ModalContainer>
    </Overlay>
  );
};

/* =========================
   STYLES
========================= */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #000000c3;
  display: grid;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 30px 0;

`;

const StyledVideo = styled.video`
  border-radius: 15px;
  position: absolute;
  height: 95%;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
    @media (max-width: 580px) {
    width: 100%;
    height: fit-content;
  }
`;

/* 🎬 Barras negras tipo cine */
const CinematicBars = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 100%;
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }
`;

/* 🎬 CTA estilo trailer cinematográfico */
const CTA = styled.div`
  position: absolute;
  bottom: 30%;
  left: 50%;
  z-index: 3;

  font-size: 3.2rem;
  font-weight: 600;
  letter-spacing: 6px;
  text-align: center;
  color: white;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  filter: ${({ $visible }) => ($visible ? "blur(0px)" : "blur(15px)")};

  transform: translateX(-50%)
    scale(${({ $visible }) => ($visible ? 1 : 1.5)});

  transition: opacity .3s ease, filter .3s ease;

  text-shadow:
    0 0 1px #000,
    0 0 3px #000,
    0 0 10px rgba(255,255,255,0.9),
    0 0 30px rgba(255,255,255,0.7),
    0 0 60px rgba(255, 0, 0, 0.8),
    0 0 120px rgba(255,0,120,1);

  ${({ $visible }) =>
    $visible &&
    `
    animation: 
      bounceIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1),
      cinematicGlow .5s infinite alternate;
  `}

  @keyframes bounceIn {
    0% {
      transform: translateX(-50%) scale(1.5);
    }
    60% {
      transform: translateX(-50%) scale(0.85);
    }
    80% {
      transform: translateX(-50%) scale(1.08);
    }
    100% {
      transform: translateX(-50%) scale(1);
    }
  }

  @keyframes cinematicGlow {
    from {
      text-shadow:
        0 0 10px rgba(255, 255, 255, 0.8),
        0 0 30px rgba(255, 0, 0, 0.7),
        0 0 60px #ff0000;
    }
    to {
      text-shadow:
        0 0 20px rgba(255,255,255,1),
        0 0 50px #ff0000,
        0 0 120px #ff0000;
    }
  }

  @media (max-width: 1280px) {
    font-size: 2rem;
    bottom: 35%;
  }

  @media (max-width: 580px) {
    font-size: 2.5rem;
    bottom: 40%;
  }
`;

/* 🎬 Botón estilo minimal cinematográfico */
const CloseButton = styled.button`
  position: absolute;
  bottom: 18%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;

  background: #000000c2;
  border: 2px solid white;
  color: white;
  padding: 12px 40px;
  font-size: 14px;
  letter-spacing: 3px;
  font-weight: 600;
  cursor: pointer;

  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? "auto" : "none")};
  transition: all 0.6s ease;

  &:hover {
    background: white;
    color: black;
    outline: var(--primary);
    border: 2px solid var(--primary);
    transform: translateX(-50%) scale(1.1);
  }

  @media (max-width: 580px) {
    bottom: 25%;
  }
`
;