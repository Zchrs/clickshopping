import styled from "styled-components"
import { RecoveryPasswordRouterClient } from "../../router/AppRouter"
import { getFile } from "../../../globalActions"
import { Link } from "react-router-dom"


export const HomeRecovery = () => {
  return (
    <RecoveryHome>
      <Link className="back" to={"/auth/login"}>Volver a login</Link>
        <div className="recovery">
            <div className="recovery-logo">
                <img src={getFile('svg', 'logo', 'svg')} alt="logo" />
            </div>
            <RecoveryPasswordRouterClient />
        </div>
    </RecoveryHome>
  )
}

const RecoveryHome = styled.div`
display: grid;
width: 100%;
height: 100%;
min-height: 100vh;
max-width: 1920px;
place-items: center;
background: var(--light);
margin: auto;
    @media (max-width: 860px) {
      padding: 0 12px;
    }
.recovery{
    display: grid;
    border-radius: 10px;
    width: 40%;
    height: fit-content;
    border: 1px solid var(--primary);
    background-color: var(--primary);
    align-items: start;
    gap: 25px;
    padding: 70px 100px;
    @media (max-width: 480px) {
      width: 100%;
      padding: 30px 10px;
    }

    &-logo{
    display: grid;
    width: 50%;
    height: fit-content;
    margin  : auto;
    img{
      width: 100%;
      filter: invert(50%) brightness(500%);
    }
  }
}
.back{
  color: var(--primary);
  position: absolute;
  top: 10px;
  left: 10px;
}
`