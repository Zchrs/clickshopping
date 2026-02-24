import styled from "styled-components"
import { getFile} from "../../../globalActions"


export const NotFound = () => {
  return (
    <NotFOund>
      <div>
        <div className="flex-s">

      <h1>4<img src={getFile("svg", "lupa", "svg")} alt="" />4 </h1>
      
        </div>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que buscas no existe o email ya fue verificado.</p>
      <p>Regresa a la <a href="/">página principal</a>.</p>
    </div>
    </NotFOund>
  )
}
 const NotFOund = styled.div`
display: grid;
  width: 100%;
  height: 100%;
  img{
    filter: brightness(800%);
    width: 200px;
  }
 `

