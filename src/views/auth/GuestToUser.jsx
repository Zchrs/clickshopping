import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import styled from "styled-components";

export const GuestToUser = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
  if (!token) {
    navigate("/no-existe", { replace: true });
  }
}, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return Swal.fire({
      title: "Error", 
      text: "Completa todos los campos", 
      icon: "warning",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
        },
      });
    }

    if (password.length < 6) {
      return Swal.fire({
        title: "Error", 
        text: "Mínimo 6 caracteres", 
        icon: "warning",
              customClass: {
        popup: "swal-custom-popup",
        title: "custom-title",
        content: "custom-content",
        confirmButton: "swal-confirm-btn",
      },
    });
    }

    if (password !== confirmPassword) {
      return Swal.fire({
        title: "Error", 
        text: "Las contraseñas no coinciden", 
        icon: "warning",
              customClass: {
        popup: "swal-custom-popup",
        title: "custom-title",
        content: "custom-content",
        confirmButton: "swal-confirm-btn",
      },
    });
    }

    try {
      setLoading(true);

      const res = await axios.post(
        import.meta.env.VITE_APP_API_GUEST_TO_USER_PASSWORD,
        { token, password }
      );

      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: res.data.message,
      });

      navigate("/auth/login");

    } catch (error) {
      Swal.fire({
        icon: "error",
        text:
          error?.response?.data?.message ||
          "Error creando contraseña",
              customClass: {
        popup: "swal-custom-popup",
        title: "custom-title",
        content: "custom-content",
        confirmButton: "swal-confirm-btn",
      },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="card">
        <h2>Crear contraseña</h2>
        <p className="subtitle">
          Activa tu cuenta para guardar tus compras
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Guardando..." : "Crear contraseña"}
          </button>
        </form>
      </div>
    </Container>
  );
};

const Container = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;

  .card {
    width: 100%;
    max-width: 400px;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.08);
    text-align: center;
  }

  h2 {
    color: #F70A04;
    margin-bottom: 10px;
  }

  .subtitle {
    color: #787878;
    font-size: 14px;
    margin-bottom: 25px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  input {
    padding: 12px;
    border: 1px solid #a8a8a8;
    border-radius: 8px;
    outline: none;
    font-size: 14px;
    transition: 0.2s;
  }

  input:focus {
    border-color: #F70A04;
    box-shadow: 0 0 0 2px rgba(247, 10, 4, 0.1);
  }

  button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: #F70A04;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
  }

  button:hover {
    background: #d00904;
  }

  button:disabled {
    background: #a8a8a8;
    cursor: not-allowed;
  }
`;