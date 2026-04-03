/* eslint-disable no-unused-vars */
import styled from "styled-components";
import { useValidations } from "../../hooks/useValidations";
import { useForm, initialForm } from "../../hooks/useForm";
import { BaseInput } from "./BaseInput";
import { useState } from "react";
import { EnterCode } from "./EnterCode";
import { BaseButton } from "./BaseButton";

export const Recovery = () => {
  const { formRefs, validateForm } = useValidations();
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);

  const initialRecoveryForm = {
    email: "",
    verifyCode: "",
    password: "",
    rePassword: "",
  };

  const { form, errors, 
    handleChange, 
    handleBlur, 
    handleChangePassword, 
    handleVerifyCode,
    handleRequestCode } = useForm(
    initialRecoveryForm,
    initialForm,
    validateForm,
  );

  const [step, setStep] = useState("email"); // 'email' o 'code' o 'reset'
  const [email, setEmail] = useState("");

const handleEmailSubmitted = async (e) => {
  e.preventDefault();

  const success = await handleRequestCode(e);
  if (success) {
    setEmail(form.email);
    setStep("code");
  }
};

const handleCodeVerified = async (e) => {
  const email = form.email;
  const code = form.verifyCode;

  const success = await handleVerifyCode(e, { email, code });

  if (success) {
    setEmail(email);
    setStep("reset");
  }
};

  return (
    <RecoverySection>
      <div className="recoverysection">

        {step === "email" && (
          <div className="recoverysection-form">
        <div>
          <h2>Ingresa tu correo electrónico</h2>
          <p>
            Ingresa el correo electrónico con el que te registraste y te
            enviaremos el PIN de recuperación de 6 dígitos, no olvides revisar
            la carpeta spam o correo no deseado.
          </p>
        </div>
            <BaseInput
              required
              width={"70%"}
              inputRef={formRefs.email}
              id="email"
              name="email"
              placeholder={"Correo electrónico"}
              classs={"inputs normal"}
              type="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.email}
            />
            <BaseButton
              handleClick={handleEmailSubmitted}
              classs={"button outline"}
              textLabel={true}
              $outline={true}
              $borderbtn={"var(--light)"}
              $colorbtnoutline = "transparent"
              $colortextbtnoutline = "var(--light)"
              $colortextbtnhoveroutline = "var()"
              $hovercolorbtnoutline = "var(--primary-semi)"
              $borderbtnhoveroutline = "var(--light)"
              label="Enviar"
            />
          </div>
        )}

        {step === "code" && (        
        <div className="recoverysection-form">
          <h2>Ingresa código de confirmación</h2>
          <p>
            Ingresa el código de confirmación enviado a tu correo
            electrónico.
          </p>
            <BaseInput
              formRefs={formRefs.verifyCode}
              classs={"inputs normal"}
              placeholder="Código de confirmación ej: 000000"
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.verifyCode}
              id="verifyCode"
              name="verifyCode"
            />
            <BaseButton
                handleClick={handleCodeVerified}
              classs={"button secondary"}
              textLabel={true}
              $colorbtn={"var(--dark)"}
              $colorbtntextsecondary={"var(--light)"}
              $colorbtnhoversecondary={"var(--secondary)"}
              $colorbtntexthoversecondary={"var(--light)"}
              $hovercolorbtntextsecondary={"var(--dark)"}
              label="Enviar"
            />
        </div>
        )}

        {step === "reset" && (
          <div className="recoverysection-form">
                      <h2>Ingresa tu nueva contraseña</h2>
          <p>
            Recuerda que la contraseña debe tener al menos 6 caracteres con letras, números y símbolos.
          </p>
            <BaseInput
              formRefs={formRefs.password}
              classs={"inputs normal"}
              placeholder="Contraseña"
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.password}
              id="password"
              name="password"
              isPassword
            />
            <BaseInput
              formRefs={formRefs.rePassword}
              classs={"inputs normal"}
              placeholder="Repite la contraseña"
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.rePassword}
              id="rePassword"
              name="rePassword"
              isPassword
            />
            {passwordMismatchError && (
              <span style={{ color: "red", fontSize: "0.9rem" }}>
                Las contraseñas no coinciden.
              </span>
            )}
<BaseButton
  handleClick={(e) => {
    e.preventDefault();
    if (form.password !== form.rePassword) {
      setPasswordMismatchError(true);
    } else {
      setPasswordMismatchError(false);
      handleChangePassword(e);
    }
  }}
  textLabel={true}
  classs={"button outline"}
$outline={true}
$borderbtn={"var(--light)"}
$colorbtnoutline = "transparent"
$colortextbtnoutline = "var(--light)"
$colortextbtnhoveroutline = "var()"
$hovercolorbtnoutline = "var(--primary-semi)"
$borderbtnhoveroutline = "var(--light)"
  label="Restablecer contraseña"
/>
          </div>
        )}
      </div>
    </RecoverySection>
  );
};

const RecoverySection = styled.section`
  display: grid;
  width: 100%;
  height: fit-content;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 25px;
  @media (max-width: 860px) {
    
  }
  .recoverysection {
    width: 100%;
    height: 100%;
    display: grid;
    gap: 25px;
    color: var(--light);
    &-form {
      width: 100%;
      display: grid;
      gap: 20px;
    }
  }
`;
