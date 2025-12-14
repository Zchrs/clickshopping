/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { BaseInput } from "../../components/globals/BaseInput"
import { BaseButton } from "../../components/globals/BaseButton"
import { CountrySelect } from "../../components/globals/CountrySelect"
import { getFile } from "../../reducers/globalReducer"
import { useTranslation } from 'react-i18next';
// import { ValidationsForm } from'../../hooks/useValidations'
import { useForm, initialForm } from'../../hooks/useForm'
import { useState } from "react";



export const RegisterScreen = () => {

  const { t } = useTranslation();

 const validationsForm = (form) => {
  
  let errors = {};
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
  let regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]+$/;
  let regexMessage = /^.{1,300}$/;
  let regexPhone = /^\+[0-9]{1,3}\s?[0-9]{10}$/;
  let name = document.getElementById("name");
  let lastName = document.getElementById("lastname");
  let country = document.getElementById("country");
  let email = document.getElementById("email");
  let phone = document.getElementById("phone");
  let message = document.getElementById("message");
  let pass = document.getElementById("password");
  let repass = document.getElementById("repassword");

  if (!form.name) {
    name.style.cssText = "border: red 1px solid;";
    errors.name = t('auth.fieldName');
  } else if (!regexName.test(form.name.trim())) {
    errors.name = "Name field have must only letters";
  } else {
    name.style.cssText = "border: #34B0BE 1px solid;";
  }

  if (!form.lastname) {
    lastName.style.cssText = "border: red 1px solid";
    errors.lastname = t('auth.fieldLastName');
  } else if (!regexName.test(form.lastname.trim())) {
    errors.lastname = "Last name field have must only letters; ";
  } else {
    lastName.style.cssText = "border: #34B0BE 1px solid;";
  }

  if (!form.email) {
    email.style.cssText = "border: red 1px solid";
    errors.email = t('auth.fieldEmail');
  } else if (!regexEmail.test(form.email.trim())) {
    errors.email = t('auth.fieldEmailWrong');
  } else {
    email.style.cssText = "border: #34B0BE 1px solid; color: black;";
  }

  // if (!form.phone) {
  //   phone.style.cssText = "border: red 1px solid";
  //   errors.phone = "Field phone are required";
  // } else if (!regexPhone.test(form.phone.trim())) {
  //   errors.phone = "Phone field have must only numbers";
  // } else if (phone.value.length <= '12') {
  //   errors.phone = "Phone format incorrect";
  // }else {
  //   phone.style.cssText = "border: #34B0BE 1px solid;";
  // }


  if (!form.country) {
    country.style.cssText = "border: red 1px solid";
    errors.country = t('auth.fieldCountry');
  } else {
    country.style.cssText = "border: #34B0BE 1px solid;";
  }


  if (!pass.value ) {
    pass.style.cssText = "border: red 1px solid";
    errors.pass = t('auth.fieldPass');
  } else if (pass.value.length <= '6') {
    errors.pass = t('auth.fieldPassLeng');
  } else if (!regexPass.test(pass.value.trim())) {
    errors.pass = t('auth.fieldPassErr');
  }

  else{
    pass.style.cssText = "border: #34B0BE 1px solid;";
  }

  // if (!form.repass ) {
  //   repass.style.cssText = "border: red 1px solid";
    
  // } else if (!regexPass.test(form.pass.trim())) {
  //   errors.repass = "pass field have must letters and numbers";
  // } else {
  //   repass.style.cssText = "border: #34B0BE 1px solid;";
  // }

  // if (pass.value !== repass.value) {
  //   repass.style.cssText = "border: red 1px solid";
  //   pass.style.cssText = "border: red 1px solid";
  //   errors.pass = "Passwords no matches"
  // }else if (pass.value === '' && repass.value === '') {
  //   repass.style.cssText = "border: red 1px solid";
  //   pass.style.cssText = "border: red 1px solid";
  //   errors.pass = "Pass pass are required";
  //   errors.repass = "Please confirm repass";
  // } else if (pass.value.length <= '6') {
  //   errors.pass = "Password must contain 7 or more characters";
  // }
  // else {
  //   pass.style.cssText = "border: #34B0BE 1px solid;";
  //   repass.style.cssText = "border: #34B0BE 1px solid;";
  // }

  // if (!form.message) {
  //   message.style.cssText = "border: red 1px solid";
  //   errors.message = "Field message are required";
  // } else if (!regexMessage.test(form.message.trim())) {
  //   errors.message = "Limit characters exceded 300 max";
  // } else {
  //   message.style.cssText = "border: #34B0BE 1px solid;";
  // }

  return errors;
};

  const {
    form,
    errors,
    loading,
    response,
    modal,
    handleChange,
    handleBlur,
    handleSubmit,
    handleSubmits,
    handleCountryChange,
    handleClearCountry,
    // onChangeValidation,
  } = useForm(initialForm, validationsForm);
  const [selected, setSelected] = useState(null);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const handleClearAll = () =>{
    handleClearCountry();
    setSelected(null);
    setShowPlaceholder(true); 
    
  }
  const handleCountrySelect = (label) =>{
    // debugger
    setShowPlaceholder(false); 
    handleCountryChange(label);
    setSelected(label);
    
  }
// console.log(form)


  return (
    <div className="auth">

      <form onSubmit={handleSubmits}>
        <div>
          <CountrySelect
          selected={selected}
           classs={"inputs outline"}
           placeholder={t('auth.location')}
           onSelect={handleCountrySelect}
           selectedCountry={handleClearAll}
          onClick={handleClearAll}
           required
          />
          {errors.country && <p className="warnings-form">{errors.country}</p>}
        </div>
        <div>
          <BaseInput
          classs={"inputs outline"}
          placeholder={t('auth.name')}
          name="name"
          id="name"
          value={form.name}
              onBlur={handleBlur}
              onChange={handleChange}
              required
          />
          {errors.name && <p className="warnings-form">{errors.name}</p>}
        </div>
        <div>
          <BaseInput
          classs={"inputs outline"}
          placeholder={t('auth.lastName')}
          name="lastname"
          id="lastname"
          value={form.lastname}
              onBlur={handleBlur}
              onChange={handleChange}
              required
          />
          {errors.lastname && <p className="warnings-form">{errors.lastname}</p>}
        </div>
        <div>
          <BaseInput
          classs={"inputs outline"}
          placeholder={t('auth.email')}
          name="email"
          id="email"
          value={form.email}
              onBlur={handleBlur}
              onChange={handleChange}
          required
          isEmail
          />
          {errors.email && <p className="warnings-form">{errors.email}</p>}
        </div>
        <div>
          <BaseInput
          classs={"inputs outline"}
          placeholder={t('auth.createPass')}
          name="password"
          id="password"
          onBlur={handleBlur}
          onChange={handleChange}
          value={form.pass}
          isPassword
          required
          />
          {errors.pass && <p className="warnings-form">{errors.pass}</p>}
        </div>

        <BaseButton handleClick={handleSubmits} classs={"button full-red-bullet"} textLabel={true} label={t('auth.newAccount')}/>
      </form>
      <div className="auth-gruop2">
        <h3>{t('auth.sesion')}</h3>
        <hr />
      </div>
      <div className="auth-social">
        <img src={getFile('svg', 'facebook', 'svg')} alt="facebook-logo" />
        <img src={getFile('svg', 'google-icon', 'svg')} alt="google-logo" />
        <img src={getFile('svg', 'twitter', 'svg')} alt="twitter-logo" />
        <img src={getFile('svg', 'linkedin', 'svg')} alt="linkedin-linkedin" />
        <img src={getFile('svg', 'apple-logo', 'svg')} alt="apple-logo" />
      </div>
      <div className="auth-tyc">
        <p>
        {t('globals.tycText')}
        </p>
      </div>
    </div>
  )
}
