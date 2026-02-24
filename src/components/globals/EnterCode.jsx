/* eslint-disable react/prop-types */
import styled from "styled-components"
import { useState } from "react"
import { BaseButton } from "./BaseButton"
// import { BaseInput } from "./BaseInput"

export const EnterCode = ({ email, onCodeVerified }) => {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!/^\d{6}$/.test(code)) {
      setError("El código debe tener 6 dígitos numéricos.")
      return
    }

    try {
      // Aquí deberías enviar el código al backend para verificarlo
      const res = await fetch(import.meta.env.VITE_APP_API_VERIFY_CODE, 
        { 
          method: 'POST', 
          body: JSON.stringify({ email, code }) })
      if (!res.ok) throw new Error()

      // Si el código es válido
      setMessage("Código verificado.")
      onCodeVerified() // Continúa con el siguiente paso (por ejemplo, formulario para nueva contraseña)
    } catch (err) {
      setError("Código inválido o expirado.")
    }
  }

  return (
    <CodeContainer>
      <form className="code-form" onSubmit={handleVerifyCode}>
        <h2>Ingresa el código</h2>
        <p className="info">Revisa tu correo: <strong>{email}</strong></p>
        <input
          type="text"
          maxLength={6}
          placeholder="Código de 6 dígitos"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {/* <BaseInput 
          classs={"inputs normal"}
          placeholder="Códigode verificación"
          onChange={handleChange}
          onBlur={handleBlur}
          value={form.password}
          id="verifyCode"
          name="verifyCode"
          isNumber
        /> */}
            <BaseButton
              handleClick={handleVerifyCode}
              classs={"button secondary"}
              textLabel={true}
              colorbtn={"var(--bg-secondary)"}
              colortextbtnsecondary={"--bg-primary"}
              colorbtnhoversecondary={"var(--bg-secondary-tr)"}
              hovercolorbtntextsecondary={"--bg-primary"}
              label="Enviar"
            />
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </CodeContainer>
  )
}

const CodeContainer = styled.div`
  display: grid;
  place-items: center;
  width: 100%;

  .code-form {
    display: grid;
    gap: 1rem;
    padding: 2rem;
    text-align: center;

    h2 {
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .info {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    input {
      padding: 0.75rem;
      border: 1px solid var(--bg-tertiary);
      border-radius: 5px;
      font-size: 1.2rem;
      text-align: center;
      letter-spacing: 0.3em;
      outline: none;
    }

    button {
      padding: 0.75rem;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }

    .error {
      color: red;
      font-size: 0.9rem;
    }

    .success {
      color: green;
      font-size: 0.9rem;
    }
  }
`