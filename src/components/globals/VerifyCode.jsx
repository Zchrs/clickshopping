/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import styled from "styled-components";
import { getFile } from "../../../globalActions";
import { BaseButton } from "./BaseButton";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NotFound } from "./NotFound";

export const VerifyCode = () => {
  const { token } = useParams(); // ⚠️ CAMBIADO: ahora usamos 'token' en lugar de 'userId'
  const navigate = useNavigate();

  // 🔹 Estados
  const [verificationToken, setVerificationToken] = useState(token || "");
  const [status, setStatus] = useState("loading"); 
  const [verificationStatus, setVerificationStatus] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 🔹 Verificar token al cargar el componente
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("invalid");
        setErrorMessage("No se proporcionó un token de verificación");
        return;
      }

      try {
        setStatus("loading");
        
        // Llamar a tu API para verificar el token
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_CLIENTS_VERIFY_URL}/${token}`
        );

        if (!response.ok) {
          setStatus("invalid");
          setErrorMessage("Token inválido o expirado");
          return;
        }

        const data = await response.json();
        
        if (data.success) {
          setStatus("valid");
          setVerificationToken(token);
          // Si la API devuelve si ya está verificado
          if (data.isVerified) {
            setVerificationStatus(true);
          }
        } else {
          setStatus("invalid");
          setErrorMessage(data.message || "Token inválido");
        }
      } catch (error) {
        console.error("Error verificando token:", error);
        setStatus("invalid");
        setErrorMessage("Error de conexión");
      }
    };

    verifyToken();
  }, [token]);

  // 🔹 Confirmar verificación
  const handleVerify = async () => {
    try {
      setLoadingAction(true);

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_CLIENTS_VERIFY_URL}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();
      setApiResponse(data);

      if (data.success) {
        setVerificationStatus(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setApiResponse({
        success: false,
        message: "Error al verificar el correo"
      });
    } finally {
      setLoadingAction(false);
    }
  };

  // 🔹 Función para copiar enlace
  const copyToClipboard = () => {
    const link = `${window.location.origin}/verify/${token}`;
    navigator.clipboard.writeText(link);
    alert("Enlace copiado al portapapeles");
  };

  return (
    <CodeVerify>
      <div className="verify">

        {/* ⏳ CARGANDO */}
        {status === "loading" && (
          <div className="container">
            <img
              className="container-logo"
              src={getFile("svg", "logo", "svg")}
              alt="logo"
            />
            <h2>Verificando enlace...</h2>
            <div className="spinner"></div>
          </div>
        )}

        {/* ❌ LINK INVÁLIDO */}
        {status === "invalid" && (
          <div className="notfound">
            <NotFound />
            <p>{errorMessage || "El enlace de verificación es inválido o ya fue usado."}</p>
            <Link to="/register" className="button full-primary">
              Crear nueva cuenta
            </Link>
          </div>
        )}

        {/* ✅ LINK VÁLIDO */}
        {status === "valid" && (
          <div className="container">
            <img
              className="container-logo"
              src={getFile("svg", "logo", "svg")}
              alt="logo"
            />

            <h2>Confirma tu correo electrónico</h2>

            {/* Si ya está verificado */}
            {verificationStatus && (
              <div className="response-message success">
                <p>✅ Tu correo ya ha sido verificado</p>
                <Link to="/login" className="button full-primary">
                  Ir al inicio de sesión
                </Link>
              </div>
            )}

            {/* 📩 RESPUESTA API */}
            {apiResponse && !verificationStatus && (
              <div
                className={`response-message ${
                  apiResponse.success ? "success" : "error"
                }`}
              >
                <p>{apiResponse.message}</p>

                {apiResponse.success && (
                  <>
                    <p>Serás redirigido al login en unos segundos...</p>
                    <Link to="/login" className="button full-primary">
                      Ir al inicio de sesión
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* 🔐 ACCIONES - Solo mostrar si no está verificado y no hay respuesta exitosa */}
            {!verificationStatus && !apiResponse?.success && (
              <>
                <BaseButton
                  classs={"button outline"}
                  textLabel={true}
                  $outline={true}
                  $borderbtn={"var(--light)"}
                  $colorbtnoutline="transparent"
                  $colortextbtnoutline="var(--light)"
                  $colortextbtnhoveroutline="var()"
                  $hovercolorbtnoutline="var(--primary-semi)"
                  $borderbtnhoveroutline="var(--light)"
                  width="100%"
                  height="50px"
                  label={loadingAction ? "Verificando..." : "Confirmar correo"}
                  handleClick={handleVerify}
                  disabled={loadingAction}
                />

                <div className="verify-box">
                  <p>O copia y pega este link:</p>
                  <div className="verify-box">
                    <strong className="verify-link">
                      {`${window.location.origin}/verify/${token}`}
                    </strong>
                    <button onClick={copyToClipboard} className="verify-btn">
                      📋 Copiar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </CodeVerify>
  );
};

const CodeVerify = styled.div`
    display: grid;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;


    .verify{
      display: grid;
      width: 100%;
      height: 100%;
      place-items: center;
      /* background-color: var(--primary); */

      &-box{
        display: grid;
      }
      &-btn{
        width: fit-content;
        margin: auto;
      }
    }

    .container{
        display: grid;
        width: 60%;
        height: fit-content;
       align-content: center;
        justify-content: center;
        text-align: center;
        background: var(--primary);
        border-radius: 24px;
        gap: 24px;
        min-height: 100vh;
        padding: 24px;
        color: white;
        margin: 0;

        &-logo{
            margin: auto;
            filter: invert(50%) brightness(500%);
            width: 180px;
        }
        p, strong{
          word-break: break-all;
          width: 100%;
        }
    }
    .notfound{
        padding: 0;
        display: grid;
        color: white;
        width: 100%;
        height: 100%;
        min-height: 100vh;
        background: var(--bg-primary);
        place-content: center;
        text-align: center;
        h1{
            font-size: 30rem;
            font-weight: 700;
        }

    }
    .success{
      font-size : 2.2rem;
      a{
        font-size : 1.5rem;
      }
    }
`