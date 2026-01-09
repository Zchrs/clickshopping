import styled from "styled-components"
import { getImg } from "../../../globalActions"
import PropTypes from "prop-types"

export const Empty = ({message}) => {
  return (
    <EmPty>
    <div>
        <img src={getImg('svg', 'empty', 'svg')} alt="" />
        <h2>{message}</h2>
    </div>
    </EmPty>
  )
}

const EmPty = styled.div`
  display: grid;
  width: fit-content;
  height: fit-content;
  margin: auto;

  img{
      width: 300px;
      filter: invert(80%);

      @media (max-width: 780px) {
        width: 100%;
      }
  }
  h2{
    color: #00000022;
  }
  div{
    display: grid;
    width: fit-content;
    height: fit-content;
    place-items: center;
    place-content: center;
  }
`

Empty.propTypes = {
  message: PropTypes.string.isRequired,
} 
