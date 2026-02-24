/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { getFile, getImg } from "../../../globalActions";
import styled from "styled-components";

export const BaseButton = ({
  label,
  icon,
  svgIcon,
  link,
  img,
  svg,
  classs,
  textLabel,
  handleClick,
  disabled,
  onMouseEnter,
  onMouseLeave,
  target,
  onSubmit,
  // ── Transient props (solo para estilos, no llegan al DOM) ──
  $colorbtn,
  $colorbtnhoverprimary,
  $colortextbtnprimary,
  $colortextbtnhoverprimary,
  $filterprimary,
  $filterprimaryhover,
  $filterhover,
  $colorbtntextsecondary,
  $hovercolorbtntextsecondary,
  $colorbtnhoversecondary,
  $filtersecondary,
  $colorbtnsmall,
  $colorbtntextsmall,
  $colorbtnhoversmall,
  $colortextbtnhoversmall,
  $borderbtn,
  $colorbtnoutline,
  $colortextbtnoutline,
  $colortextbtnhoveroutline,
  $hovercolorbtnoutline,
  $borderbtnhoveroutline,
  $filteroutline,
  $filterhoveroutline,
  $outline,
}) => {
  return (
    <ButtonBase
      $colorbtn={$colorbtn}
      $colorbtnhoverprimary={$colorbtnhoverprimary}
      $colortextbtnprimary={$colortextbtnprimary}
      $colortextbtnhoverprimary={$colortextbtnhoverprimary}
      $filterprimary={$filterprimary}
      $filterprimaryhover={$filterprimaryhover}
      $filterhover={$filterhover}
      $colorbtntextsecondary={$colorbtntextsecondary}
      $hovercolorbtntextsecondary={$hovercolorbtntextsecondary}
      $colorbtnhoversecondary={$colorbtnhoversecondary}
      $filtersecondary={$filtersecondary}
      $colorbtnsmall={$colorbtnsmall}
      $colorbtntextsmall={$colorbtntextsmall}
      $colorbtnhoversmall={$colorbtnhoversmall}
      $colortextbtnhoversmall={$colortextbtnhoversmall}
      $colorbtnoutline={$colorbtnoutline}
      $borderbtn={$borderbtn}
      $colortextbtnoutline={$colortextbtnoutline}
      $colortextbtnhoveroutline={$colortextbtnhoveroutline}
      $hovercolorbtnoutline={$hovercolorbtnoutline}
      $borderbtnhoveroutline={$borderbtnhoveroutline}
      $filteroutline={$filteroutline}
      $filterhoveroutline={$filterhoveroutline}
      $outline={$outline}
    >
      <button
        disabled={disabled}
        onClick={handleClick}
        className={`${classs || ""} ${disabled ? "disabled" : ""}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        // onSubmit solo tiene sentido en <form>, probablemente deberías quitarlo
        // onSubmit={onSubmit}
        {...(target ? { target, rel: "noopener noreferrer" } : {})}
      >
        <Link className="button__a" to={link || "#"} rel="noopener" target={target}>
          {img && icon && <img src={getFile("svg", icon, "svg")} alt="" />}
          {svg && svgIcon && <img src={getImg("svg", svgIcon, "svg")} alt="" />}
          {(link || textLabel) && <span className="button__span">{label}</span>}
        </Link>
      </button>
    </ButtonBase>
  );
};

const ButtonBase = styled.div`
  background: transparent;
  display: grid;

  button {
    background: transparent;
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: 12px;
    margin: 0;
    padding: 0;

    &.primary {
      display: grid;
      width: ${({ width }) => width || "auto"};
      height: ${({ height }) => height || "auto"};
      position: relative;

      .button__a {
        position: relative;
        text-decoration: none;
        justify-content: center;
        align-items: center;
        gap: 5px;
        display: flex;
        padding: 10px 15px;
        width: ${({ width }) => width || "auto"};
        height: ${({ height }) => height || "auto"};
        background: ${(props) => props.$colorbtn || "transparent"};
        color: ${(props) => props.$colortextbtnprimary || "transparent"};
        border-radius: 10px;
        font-weight: 500;
        font-size: 15px;
        transition: all ease 0.3s;

        img {
          filter: ${(props) => props.$filterprimary || "brightness(500%)"};
          width: 13%;
        }

        &:hover {
          background: ${(props) => props.$colorbtnhoverprimary || "transparent"};
          color: ${(props) => props.$colortextbtnhoverprimary || "transparent"};

          img {
            filter: ${(props) => props.$filterprimaryhover || "brightness(500%)"};
            width: 13%;
          }
        }

        span {
          width: fit-content;
        }
      }
    }

    &.secondary {
      display: grid;
      width: 100%;
      height: fit-content;

      .button__a {
        font-size: 16px;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 5px;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: ${(props) => props.$colorbtn || "transparent"};
        border: none;
        color: ${(props) => props.$colorbtntextsecondary || "var(--text-secondary)"};
        border-radius: 10px;
        padding: 12px 16px;
        line-height: 120%;
        transition: all ease 0.3s;

        img {
          width: 10%;
          filter: ${(props) => props.$filtersecondary || "brightness(500%)"};
        }

        &:hover {
          background: ${(props) => props.$colorbtnhoversecondary || "var(--bg-secondary)"};
          color: ${(props) => props.$hovercolorbtntextsecondary || "var(--text-secondary)"};
        }
      }
    }

    &.small {
      display: grid;
      width: fit-content;
      height: fit-content;
      overflow: hidden;

      .button__a {
        position: relative;
        overflow: hidden;
        text-decoration: none;
        margin: 0 auto;
        display: grid;
        justify-content: center;
        width: fit-content;
        height: fit-content;
        background: ${(props) => props.$colorbtnsmall || "transparent"};
        color: ${(props) => props.$colorbtntextsmall || "var(--text-secondary)"};
        border-radius: 50px;
        padding: 5px 9px;
        font-weight: 600;
        font-size: 17px;
        line-height: 120%;
        transition: all ease 0.3s;

        @media (max-width: 550px) {
          font-size: 13px;
          font-weight: 400;
        }

        img {
          filter: brightness(500%);
          width: 18%;
        }

        &:hover {
          background: ${(props) => props.$colorbtnhoversmall || "transparent"};
          color: ${(props) => props.$colortextbtnhoversmall || "var(--dark)"};
        }
      }
    }

    &.outline {
      display: grid;
      width: 100%;
      height: 100%;

      .button__a {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 5px;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: ${(props) => props.$colorbtnoutline || "transparent"};
        border: ${(props) => props.$borderbtn || "transparent"} 1px solid;
        color: ${(props) => props.$colortextbtnoutline || "transparent"};
        border-radius: 10px;
        padding: 7px 16px;
        font-weight: 600;
        font-size: 17px;
        line-height: 120%;
        transition: all ease 0.3s;

        @media (max-width: 820px) {
          font-size: 14px;
        }

        img {
          width: 12%;
          transition: all ease 0.3s;
          filter: ${(props) => props.$filteroutline || "brightness(0%) invert(0%)"};
        }

        &:hover {
          background: ${(props) => props.$hovercolorbtnoutline || "transparent"};
          color: ${(props) => props.$colortextbtnhoveroutline || "transparent"};
          border: ${(props) => props.$borderbtnhoveroutline || "var(--border-primary)"} 1px solid;

          img {
            filter: ${(props) => props.$filterhoveroutline || "brightness(500%) invert(0%)"};
          }
        }
      }
    }

    /* Mantengo las otras variantes sin cambios por brevedad, pero aplica el mismo patrón con $ */
    &.primary-gradient,
    &.full-bullet,
    &.delete,
    &.update {
      padding: 8px 15px;
      border-radius: 8px;
      a{
        color: var(--light);
      }
    }
    &.delete{
      background: var(--primary);
    }
    &.update{
      background: var(--info);
    }

    &.disabled {
      cursor: default;
      z-index: 50;
      opacity: 0.6;
      transition: all ease 0.4s;

      .button__a {
        cursor: not-allowed;
        background: gray;
      }
    }
  }
`;