/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { BaseInput } from "../../components/globals/BaseInput";
import { BaseButton } from "../../components/globals/BaseButton";
import { getFile } from "../../reducers/globalReducer";
import { useTranslation } from "react-i18next";
import rawCountries from "../../../countries.json";
import { useValidations } from "../../hooks/useValidations";
import { useForm } from "../../hooks/useForm";
import { useState } from "react";

export const RegisterScreen = () => {
  const [isFormComplete, setIsFormComplete] = useState(null);
  const { formRefs, validateForm } = useValidations();
  const { t } = useTranslation();

  const initialForm = {
    country: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    name: "",
    lastname: "",
    phone: "",
    email: "",
    role: "user",
    password: "",
  };

  const countries = rawCountries.map((c) => ({
    label: c.name,
    value: c.iso2,
    dialCode: c.dialCode,
  }));

  const {
    form,
    handleChange,
    handleBlur,
    handleSubmits,
    handleCountryChange,
    handlePhoneChange,
  } = useForm(initialForm, validateForm, countries);

  const formComplete = () => {
    // Verificar si todos los campos del formulario están llenos
    const isFormFilled = Object.values(form).every((value) => value !== "");
    // Actualizar el estado de completitud del formulario
    // console.log("Formulario vacío:", form);
    setIsFormComplete(isFormFilled);
  };
  return (
    <div className="auth">
      <form onSubmit={handleSubmits}>
        <div className="grid-2fr">
          <BaseInput
            inputRef={formRefs.country}
            isSearchableSelect
            isSelect
            height={"100%"}
            width={"100%"}
            classs={"inputs normal"}
            id="country"
            placeholder={t("auth.location")}
            name="country"
            // ✅ CORRECCIÓN: Encontrar el objeto completo basado en form.country
            value={form.country}
            onChange={handleCountryChange}
            onBlur={handleBlur}
            options={countries}
            required
          />
          <BaseInput
            inputRef={formRefs.name}
            classs={"inputs normal"}
            placeholder={t("auth.name")}
            name="name"
            id="name"
            value={form.name}
            onBlur={handleBlur}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <BaseInput
            inputRef={formRefs.lastname}
            classs={"inputs normal"}
            placeholder={t("auth.lastName")}
            name="lastname"
            id="lastname"
            value={form.lastname}
            onBlur={handleBlur}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <BaseInput
            inputRef={formRefs.phone}
            type="tel"
            classs={"inputs normal"}
            id="phone"
            name="phone"
            placeholder={t("auth.phone")}
            value={form.phone}
            onChange={handlePhoneChange}
            onBlur={handleBlur}
            required
          />
        </div>
        <div>
          <BaseInput
            inputRef={formRefs.email}
            classs={"inputs normal"}
            placeholder={t("auth.email")}
            name="email"
            id="email"
            value={form.email}
            onBlur={handleBlur}
            onChange={handleChange}
            required
            isEmail
          />
        </div>
        <div>
          <BaseInput
            inputRef={formRefs.password}
            classs={"inputs normal"}
            placeholder={t("auth.createPass")}
            name="password"
            id="password"
            onBlur={handleBlur}
            onChange={handleChange}
            value={form.password}
            isPassword
            required
          />
        </div>

        <BaseButton
          handleClick={handleSubmits}
          disabled={!formComplete}
          textLabel={true}
          label={t("auth.newAccount")}
          classs={`button primary ${!isFormComplete ? "button primary disabled" : ""}`}
          $colorbtn={"var(--primary)"}
          $colortextbtnprimary={"var(--light)"}
          $colorbtnhoverprimary={"var(--bg-primary-tr)"}
          $colortextbtnhoverprimary={"white"}
        />
      </form>
      <div className="auth-gruop2">
        <h3>{t("auth.sesion")}</h3>
        <hr />
      </div>
      <div className="auth-social">
        <img src={getFile("svg", "facebook", "svg")} alt="facebook-logo" />
        <img src={getFile("svg", "google-icon", "svg")} alt="google-logo" />
        <img src={getFile("svg", "twitter", "svg")} alt="twitter-logo" />
        <img src={getFile("svg", "linkedin", "svg")} alt="linkedin-linkedin" />
        <img src={getFile("svg", "apple-logo", "svg")} alt="apple-logo" />
      </div>
      <div className="auth-tyc">
        <p>{t("globals.tycText")}</p>
      </div>
    </div>
  );
};
