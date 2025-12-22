/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import styled from 'styled-components';
import { BaseButton, BaseInput } from "../../../../index";
import { useForm } from "../../../hooks/useForm";
import { startCheckingAdmin } from "../../../actions/authActions";


import { Link } from "react-router-dom"
import { useEffect } from "react";

export const HomeScreenAdmin = () => {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startCheckingAdmin());
  }, [dispatch]);
  
  const initialForm = {
    email: "",
    pass: "",
  };

  const validationsLogin = (formAdmin) => {
    let errors = {};
   let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
    let regexPass = /^@[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  
  const email = document.getElementById("email");
  const pass = document.getElementById("pass");
  
  if (!formAdmin.email) {
    email.style.cssText = "border: red 1px solid";
    errors.email = "Field email is required";
  } else if (!regexEmail.test(formAdmin.email.trim())) {
    errors.email = "Email incorrect";
  } else {
    email.style.cssText = "border: #34B0BE 1px solid;";
  }
  
  
  if (!formAdmin.pass) {
    pass.style.cssText = "border: red 1px solid";
    errors.pass = "Field Password is required";
  } 
  else if (!regexPass.test(formAdmin.pass.trim())) {
    errors.pass = "Password field have must letters and numbers";
  } else {
    pass.style.cssText = "border: #34B0BE 1px solid;";
    console.log('entrando al else');
  }
  if (pass.value !== '') {
    pass.style.cssText = "border: #34B0BE 1px solid;";
    errors.pass = false
  }
  
  
   return errors;
  };



  const {
    formAdmin,
    errors,
    loading,
    response,
    handleLoginAdmin,
    handleChangeAdmin,
    handleBlur
  } = useForm(initialForm, validationsLogin);

  return (
    <AdminHome className="home">
         <form>
        <div>
          <BaseInput
          classs={"inputs normal"}
          placeholder={t('auth.email')}
          id="email"
          name="email"
          value={formAdmin.email}
          onBlur={handleBlur}
          onChange={handleChangeAdmin}
          
          isEmail
          />
          {errors.email && <p className="warnings-form">{errors.email}</p>}
        </div>
        <div>
          <BaseInput
          classs={"inputs normal"}
          placeholder={t('auth.yourPass')}
          onBlur={handleBlur}
          onChange={handleChangeAdmin}
          value={formAdmin.pass}
          id="pass"
          name="pass" 
          isPassword
          
          />
          {errors.pass && <p className="warnings-form">{errors.pass}</p>}
        </div>
        <div>
          <Link className="home-a">{t('auth.forgetPass')}</Link>
        </div>
        <div>
          <BaseButton 
          handleClick={handleLoginAdmin} 
          classs={"button primary"} 
          colorbtn={"var(--primary)"}
          colortextbtnprimary={"var(--light)"}
          colorbtnhoverprimary={"var(--primary-light)"}
          colortextbtnhoverprimary={"var(--light)"}
          textLabel={true} 
          label={t('auth.login')}
          />
        </div>
      </form>
      <p className="home-p">Control panel V1.0</p>
    </AdminHome>
  )
}

const AdminHome = styled.section`

    display: grid;
    position: relative;
    width: 100%;

    .home-a{
        margin: auto;
        width: fit-content;
        display: grid;
        color: white;
        text-decoration: none;
        margin-top: 10px;
        // border: white 1px solid;
    }
    .home-p{
        width: 100%;
        margin-top: 15px;
        text-align: center;
        color: white;
        font-size: 14px;
       
    }

    form{
        margin: auto;
        width:16%;
        display: grid;
        gap: 10px;
        @media (max-width: 680px) {
            width: 80%;
        }
    }

`