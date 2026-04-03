
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styled from "styled-components";

export const UsersGuest = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingAll, setSendingAll] = useState(false);

  // 🔥 obtener guests
  const fetchGuests = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        import.meta.env.VITE_APP_API_GET_USERS_GUESTS
      );

      setGuests(res.data.users || []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron obtener los invitados", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  // 🔥 enviar a uno
  const handleSendPassword = async (guest) => {
    try {
      const confirm = await Swal.fire({
        title: "Enviar contraseña",
        text: `¿Enviar acceso a ${guest.email}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, enviar",
      });

      if (!confirm.isConfirmed) return;

      await axios.post(
        import.meta.env.VITE_APP_API_SEND_PASSWORD_GUEST,
        { guest_id: guest.id }
      );

      Swal.fire("Listo", "Correo enviado correctamente", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Error enviando correo",
        "error"
      );
    }
  };

  // 🔥 enviar a todos
  const handleSendAll = async () => {
    try {
      const confirm = await Swal.fire({
        title: "Enviar a todos",
        text: "Se enviará acceso a TODOS los invitados",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, enviar todo",
      });

      if (!confirm.isConfirmed) return;

      setSendingAll(true);

      await axios.post(
        import.meta.env.VITE_APP_API_SEND_PASSWORD_ALL_GUESTS
      );

      Swal.fire("Listo", "Correos enviados a todos", "success");
    } catch (error) {
      Swal.fire("Error", "Error enviando correos", "error");
    } finally {
      setSendingAll(false);
    }
  };

  return (
    <Container>
      <div className="header">
        <h2>Usuarios Invitados</h2>

        <button
          className="send-all"
          onClick={handleSendAll}
          disabled={sendingAll}
        >
          {sendingAll ? "Enviando..." : "Enviar contraseña a todos"}
        </button>
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : guests.length === 0 ? (
        <p>No hay usuarios invitados</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {guests.map((g) => (
              <tr key={g.id}>
                <td>{g.name || "Sin nombre"}</td>
                <td>{g.email}</td>
                <td>{g.phone || "-"}</td>
                <td>
                  <button
                    onClick={() => handleSendPassword(g)}
                    className="send-btn"
                  >
                    Enviar contraseña
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  h2 {
    color: #F70A04;
  }

  .send-all {
    background: #F70A04;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 10px;
    overflow: hidden;
  }

  th, td {
    padding: 12px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  th {
    background: #f5f5f5;
  }

  .send-btn {
    background: #0a7cff;
    color: white;
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
  }
`;