import styled from "styled-components";

// eslint-disable-next-line react/prop-types
export const BaseCheckbox = ({ label, modelValue, valueChange, id }) => {
    return (
      <CheckBox>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={modelValue}
            onChange={valueChange}
            id={id}
          />
          <label htmlFor={id}>{label}</label>
          <span className="checkmark"></span>
        </label>
      </CheckBox>
    );
  };

  const CheckBox = styled.div`
  display: block;
  .checkbox {
  display: flex;
  gap: 4px;
  align-items: center;
  input[type="checkbox"] {
    appearance: none;
    min-width: 16px;
    min-height: 16px;
    border-radius: 6px;
    background: $bg-input;
    border: $border-input;
    cursor: pointer;
    &:checked {
      background-color: $primary;
      background-image: url("@/assets/icons/form/check.svg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
  }
  label {
    font-weight: 400;
    color: $text-tertiary;
    font-size: 1.7rem;
    font-weight: 2.4rem;
    cursor: pointer;
  }
}
  `