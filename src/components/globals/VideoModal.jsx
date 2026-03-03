/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getFile } from "../../../globalActions";

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

export const VideoModal = ({ videoSrc, forceOpen = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  
  // 🟢 useRef para recordar si ya se mostró en esta sesión
  const hasShownThisSession = useRef(false);

  /* =========================
     Abrir modal solo una vez por sesión
  ========================= */
  useEffect(() => {
    // Si ya se mostró en esta sesión, no abrir de nuevo
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
      
      // Marcar que ya se mostró en esta sesión
      hasShownThisSession.current = true;
    }

    return () => {
      document.body.style.overflow = "";
      clearTimeout(timerRef.current);
    };
  }, [forceOpen]); // ✅ Dependencias correctas

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
     Reproducir video y detectar FIN REAL
  ========================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpen) return;

    const handleLoaded = () => {
      const durationMs = video.duration * 1000;

      timerRef.current = setTimeout(() => {
        setCanClose(true);
      }, durationMs - 100);
    };

    video.addEventListener("loadedmetadata", handleLoaded);

    video.play().catch(() => {
      console.warn("Autoplay bloqueado por el navegador");
    });

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  /* =========================
     Cerrar modal
  ========================= */
  const handleClose = () => {
    if (!canClose) return;

    localStorage.setItem("promo_last_seen", Date.now().toString());

    setIsOpen(false);
    document.body.style.overflow = "";
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <StyledVideo
          ref={videoRef}
          src={getFile("video", videoSrc, "mp4")}
          muted
          playsInline
          preload="auto"
        />

        <CTA>¡Disponible ahora en CLICKSHOPPING!</CTA>

        <CloseButton visible={canClose} onClick={handleClose}>
          Cerrar
        </CloseButton>
      </ModalContainer>
    </Overlay>
  );
};


/* =========================
   Styled Components
========================= */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 900px;
  background: #000;
  border-radius: 18px;
  overflow: hidden;
`;

const StyledVideo = styled.video`
  width: 100%;
  display: block;
`;

const CTA = styled.div`
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 1.6rem;
  font-weight: 700;
  pointer-events: none;
  text-shadow: 0 6px 15px rgba(0, 0, 0, 0.9);
`;

/* 🔥 BOTÓN EN EL CENTRO DEL VIDEO */
const CloseButton = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: fit-content;
  height: fit-content;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  border: none;
  padding: 14px 56px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? "auto" : "none")};
  transition: opacity 0.4s ease, transform 0.4s ease;

  ${({ visible }) =>
    visible &&
    `
    transform: scale(1.05);
    border: var(--light) 2px solid;
  `}
  &:hover{
    transform: scale(1.2);
  }
`;