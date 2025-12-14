/* eslint-disable no-unused-vars */
import { Link, Navigate } from "react-router-dom"
import { BaseButton } from "../../components/globals/BaseButton"
import { BaseInput } from "../../components/globals/BaseInput"
import { getFile } from "../../reducers/globalReducer"
import { useTranslation } from 'react-i18next';
import { useForm } from "../../hooks/useForm";
import { useDispatch } from "react-redux";
import { startChecking } from "../../actions/authActions";
import Loader from "../../components/globals/Loader";
import Message from "../../components/globals/Message";
import { useEffect } from "react";



export const LoginScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startChecking());
  }, [dispatch]);
  const initialForm = {
    email: "",
    password: "",
  };

  const validationsLogin = (form) => {
    let errors = {};
   let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
    let regexPass = /^@[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  
  if (!form.email) {
    email.style.cssText = "border: red 1px solid";
    errors.email = "Field email is required";
  } else if (!regexEmail.test(form.email.trim())) {
    errors.email = "Email incorrect";
  } else {
    email.style.cssText = "border: #34B0BE 1px solid;";
  }
  
  
  if (!form.password) {
    password.style.cssText = "border: red 1px solid";
    errors.password = "Field Password is required";
  } 
  else if (!regexPass.test(form.password.trim())) {
    errors.password = "Password field have must letters and numbers";
  } else {
    password.style.cssText = "border: #34B0BE 1px solid;";
    console.log('entrando al else');
  }
  if (password.value !== '') {
    password.style.cssText = "border: #34B0BE 1px solid;";
    errors.password = false
  }
  
  
   return errors;
  };



  const {
    form,
    errors,
    loading,
    response,
    handleLogin,
    loadingActive,
    handleChange,
    handleBlur
  } = useForm(initialForm, validationsLogin);
  return (
    <section className="auth">
      <form>
        <div>
          <BaseInput
          classs={"inputs outline"}
          placeholder={t('auth.email')}
          id="email"
          name="email"
          value={form.email}
          onBlur={handleBlur}
          onChange={handleChange}
          
          isEmail
          />
          {errors.email && <p className="warnings-form">{errors.email}</p>}
        </div>
        <div>
          <BaseInput
          classs={"inputs outline"}
          placeholder={t('auth.yourPass')}
          onChange={handleChange}
          onBlur={handleBlur}
          value={form.password}
          id="password"
          name="password" 
          isPassword
          
          />
          {errors.email && <p className="warnings-form">{errors.password}</p>}
        </div>
        <Link className="a">{t('auth.forgetPass')}</Link>
        <BaseButton handleClick={handleLogin} classs={"button full-red-bullet"} textLabel={true} label={t('auth.login')}/>
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
    </section>
  )
}
