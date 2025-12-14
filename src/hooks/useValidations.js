/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react'
import jsxRuntime from 'react/jsx-runtime';
import { useTranslation } from 'react-i18next';

// export const validationsForm = (form, props) => {

//   const { t } = useTranslation();
  
//     let errors = {};
//     let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
//     let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
//     let regexPass = /^@[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
//     let regexMessage = /^.{1,300}$/;
//     let regexPhone = /^\+[0-9]{1,3}\s?[0-9]{10}$/;
//     let name = document.getElementById("name");
//     let lastName = document.getElementById("lastname");
//     let country = document.getElementById("country");
//     // console.log(country)
//     let email = document.getElementById("email");
//     let phone = document.getElementById("phone");
//     let message = document.getElementById("message");
//     let pass = document.getElementById("password");
//     let repass = document.getElementById("repassword");
  
//     if (!form.name) {
//       name.style.cssText = "border: red 1px solid;";
//       errors.name = "Field name is required";
//     } else if (!regexName.test(form.name.trim())) {
//       errors.name = "Name field have must only letters";
//     } else {
//       name.style.cssText = "border: #34B0BE 1px solid;; color: red;";
//     }
  
//     if (!form.lastname) {
//       lastName.style.cssText = "border: red 1px solid";
//       errors.lastname = "Field last name is required";
//     } else if (!regexName.test(form.lastname.trim())) {
//       errors.lastname = "Last name field have must only letters; color: red;";
//     } else {
//       lastName.style.cssText = "border: #34B0BE 1px solid;";
//     }
  
//     if (!form.email) {
//       email.style.cssText = "border: red 1px solid";
//       errors.email = "Field email is required";
//     } else if (!regexEmail.test(form.email.trim())) {
//       errors.email = "Email incorrect";
//     } else {
//       email.style.cssText = "border: #34B0BE 1px solid; color: red;";
//     }
  
//     // if (!form.phone) {
//     //   phone.style.cssText = "border: red 1px solid";
//     //   errors.phone = "Field phone are required";
//     // } else if (!regexPhone.test(form.phone.trim())) {
//     //   errors.phone = "Phone field have must only numbers";
//     // } else if (phone.value.length <= '12') {
//     //   errors.phone = "Phone format incorrect";
//     // }else {
//     //   phone.style.cssText = "border: #34B0BE 1px solid;";
//     // }
  
  
//     if (!form.country) {
//       country.style.cssText = "border: red 1px solid";
//       errors.country = "Field country is required";
//     } else {
//       country.style.cssText = "border: #34B0BE 1px solid;";
//     }
  
  
//     if (!form.pass ) {
//       pass.style.cssText = "border: red 1px solid";
//       errors.pass = "Password is required";
      
//     } else if (!regexPass.test(form.pass.trim())) {
//       errors.pass = "pass field have must letters and numbers";
//     } else {
//       pass.style.cssText = "border: #34B0BE 1px solid;";
//     }
  
//     // if (!form.repass ) {
//     //   repass.style.cssText = "border: red 1px solid";
      
//     // } else if (!regexPass.test(form.pass.trim())) {
//     //   errors.repass = "pass field have must letters and numbers";
//     // } else {
//     //   repass.style.cssText = "border: #34B0BE 1px solid;";
//     // }
  
//     // if (pass.value !== repass.value) {
//     //   repass.style.cssText = "border: red 1px solid";
//     //   pass.style.cssText = "border: red 1px solid";
//     //   errors.pass = "Passwords no matches"
//     // }else if (pass.value === '' && repass.value === '') {
//     //   repass.style.cssText = "border: red 1px solid";
//     //   pass.style.cssText = "border: red 1px solid";
//     //   errors.pass = "Pass pass are required";
//     //   errors.repass = "Please confirm repass";
//     // } else if (pass.value.length <= '6') {
//     //   errors.pass = "Password must contain 7 or more characters";
//     // }
//     // else {
//     //   pass.style.cssText = "border: #34B0BE 1px solid;";
//     //   repass.style.cssText = "border: #34B0BE 1px solid;";
//     // }
  
//     // if (!form.message) {
//     //   message.style.cssText = "border: red 1px solid";
//     //   errors.message = "Field message are required";
//     // } else if (!regexMessage.test(form.message.trim())) {
//     //   errors.message = "Limit characters exceded 300 max";
//     // } else {
//     //   message.style.cssText = "border: #34B0BE 1px solid;";
//     // }
  
//     return errors;
//   };


  
export const ValidationsForm = ({ form }) => {
    
  const { t } = useTranslation();
  
  let errors = {};
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
  let regexPass = /^@[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexMessage = /^.{1,300}$/;
  let regexPhone = /^\+[0-9]{1,3}\s?[0-9]{10}$/;
  // let name = document.getElementById("name");
  // let lastName = document.getElementById("lastname");
  // let country = document.getElementById("country");
  // console.log(country)
  const name = React.useRef(null);
  const lastName = React.useRef(null);
  const email = React.useRef(null);
  const country = React.useRef(null);
  const pass = React.useRef(null);

  if (!form.name) {
    name.style.cssText = "border: red 1px solid;";
    errors.name = t('auth.fieldName');
  } else if (!regexName.test(form.name.trim())) {
    errors.name = "Name field have must only letters";
  } else {
    name.style.cssText = "border: #34B0BE 1px solid;; color: red;";
  }

  if (!form.lastname) {
    lastName.style.cssText = "border: red 1px solid";
    errors.lastname = t('auth.fieldLastName');
  } else if (!regexName.test(form.lastname.trim())) {
    errors.lastname = "Last name field have must only letters; color: red;";
  } else {
    lastName.style.cssText = "border: #34B0BE 1px solid;";
  }

  if (!form.email) {
    email.style.cssText = "border: red 1px solid";
    errors.email = t('auth.fieldEmail');
  } else if (!regexEmail.test(form.email.trim())) {
    errors.email = "Email incorrect";
  } else {
    email.style.cssText = "border: #34B0BE 1px solid; color: red;";
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


  if (!form.pass ) {
    pass.style.cssText = "border: red 1px solid";
    errors.pass = t('auth.fieldPass');
    
  } else if (!regexPass.test(form.pass.trim())) {
    errors.pass = "pass field have must letters and numbers";
  } else {
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
    return jsxRuntime.jsxs(errors)
    
  }
  
