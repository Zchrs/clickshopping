/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { getFile } from '../../reducers/globalReducer';
import styled from 'styled-components';
export const BaseInput = ({
  label,
  placeholder,
  classs,
  id,
  name,
  value = '',
  required,
  onChange,
  isTextarea,
  isNumber,
  onBlur,
  isEmail,
  isPassword, // Nuevo prop para controlar si es un campo de contraseña
}) => {

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    return (
      <InputBase>
        <div className={classs}>
          <label htmlFor={id}>
            {required && <span>*</span>}
            {label}
          </label>
          {isTextarea ? (
            <textarea
              {...(placeholder && { placeholder })}
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          ) : (
            <>
              <input
                {...(placeholder && { placeholder })}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                type={
                  isPassword && !showPassword ? 'password' : isEmail ? 'email' : isNumber ? 'number' : 'text'
                }
              />
              {isPassword && (
                <div
                  type="button"
                  className="inputs-show-hide-pass"
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={showPassword ? getFile('svg', 'hide-icon', 'svg') : getFile('svg', 'show-icon', 'svg')}
                    alt={showPassword ? 'Hide' : 'Show'}
                    className="eye-icon"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </InputBase>
    );
};


const InputBase = styled.div`
  .inputs {
    display: grid;
    margin: 0;
    padding: 0;
    gap: 4px;

    &.outline{
      position: relative;
      outline: none;

      textarea{
        border: 1px solid #ec333632;
        background: white;
        font-size: 16px;
        font-weight: 500;
        border-radius: 7px;
        outline: none;
        color: black;
        font-weight: 400;
        position: relative;
        padding: 15px;

        &::placeholder {
          font-weight: 300;
          font-size: 14px;
          line-height: 140%;
          font-weight: 200;
          color: #bdbbbb;
        }
      }
      
      input{
        border: 1px solid #ec333632;
        background: white;
        font-size: 16px;
        font-weight: 500;
        border-radius: 7px;
        outline: none;
        color: black;
        font-weight: 400;
        position: relative;

        @media (max-width: 920px) {
          height: 70px;
          font-size: 18px;
      }
      }
    }

    &-show-hide-pass{
      display: grid;
      place-items: center;
      border: none;
      outline: none;
      position: absolute;
      right: 10px;
      bottom: 0px;
      width: 8%;
      // background: white;
      height: 85%;
      border-radius: 0 7px 7px 0;
      cursor: pointer;
      font-size: 12px;
      transition: all ease .3s;

      @media (max-width: 680px) {
        width: 10%;
      }
      img{

        width: 100%;
        filter: invert(70%);
      }
      
      input:focus + & {
        /* right: -50px; */
        @media (max-width: 680px) {
          right: 10px;
        } 
    }
    }
    &.normal {
      position: relative;
      color: black;
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    //   border: 1px solid;
      align-items: center;
      display: grid;
      // background: white;
  
  
      input{
        position: relative;
        background: white;
        border: #575757 1px solid;
        padding: 12px 16px;
        color: black;
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 1px;
        width: 100%;
        transition: all ease .3s;
        &:focus{
          width: 120%;
          img{
            width: 100%;
            filter: invert(70%);
          }
          @media (max-width: 680px) {
            width: 100%;
          }
        }
      }
      }
    label {
  
      font-weight: 400;
      font-size: 14px;
      line-height: 140%;
      color: #295170;
  
      span {
        margin: auto;
        margin-top: 0;
        margin-bottom: 0;
        position: absolute;
        color: red;
        font-weight: 700;
        margin-left: -5px;
      }
    }
  
    input {
      position: relative;
      padding: 12px 16px;
      background: transparent;
      border: 1px solid #DDE4ED;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
  
  
      &:focus {
        outline: none;
      }
  
      &::placeholder {
        font-weight: 300;
        font-size: 14px;
        line-height: 140%;
        font-weight: 200;
        color: #bdbbbb;
      }
    }
  }
`