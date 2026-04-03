/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { getFile } from "../../reducers/globalReducer"
import { startCheckingAdmin, startLogoutAdmin } from "../../actions/authActions";
import styled from "styled-components";

export const AvatarAdmin = ({avtsmall, avtMedium, img, clas, dropData, classWhite, nameSmall, nameAdm}) => {
    
const admin = useSelector((state) => state.authAdmin.admin);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lang = useSelector(state => state.langUI.lang);
    const { t, i18n } = useTranslation();

    useEffect(() => {
      i18n.changeLanguage(lang);
      dispatch(startCheckingAdmin());
    }, [i18n, lang, dispatch]);

    const handleLogout = () => {
      dispatch(startLogoutAdmin());
      navigate("/");
    };
    
  return (
    <AvtAdm>
      <div className={clas}>
          {avtMedium && (<div className="avtadm-default"><img src={getFile('png', `${img}`, 'png')} alt="" /></div>)}
          {avtsmall && (<div className="tumb-default"><img src={getFile('png', `${img}`, 'png')} alt="" /></div>)}
          <span className={classWhite}>
            {admin ? <strong className={nameSmall}>{nameAdm}</strong> : <strong className={nameSmall}>Default name</strong>}
          </span>
          {dropData && (
          <div>
            <div className="avtadm-usersession">
                <button onClick={handleLogout}><i><img src={getFile('svg', 'off', 'svg')} alt="" /></i>{ t("dashboard.logout") }</button>
            </div>
          </div> )}
      </div>
    </AvtAdm>
  )
}

const AvtAdm = styled.div`
  .avtadm{
    position: relative;
    cursor: pointer;
    display: grid;
    gap: 10px;
    align-items: start;
    text-align: center;
    position: relative;
    height: fit-content;
    width: 100%;
    @media (max-width: 920px) {
        display: flex;
    }
    @media (max-width: 300px) {
        gap: 5px;
        
    }
    &-default{
        position: relative;
        display: grid;
        width: fit-content;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        @media (max-width: 920px) {
            width: 50px;
            height: 50px;
        }
        img{
            height: 100px;
            width: 100px;
        }
    }
    .namesmall{
        font-size: 8px;
        font-weight: 700;
        padding: 0;
        position: absolute;
        width: 100%;
        left: 0px;
        bottom: 0;

    }
    .namepanel{
        display: flex;
        text-align: center;
        font-weight: 600;
        width: 150%;
        margin-left: -17px;
    }
    .white{
        color: white;
    }
    .black{
        color: black;
    }

    &-usersession{
        display: grid;
        position: absolute;
        z-index: 999;
        top: 32px;
        left: -145px;
        padding:0;
        width: 280px;
        height: fit-content;
        transform: scaleY(0);
        background: white;
        border-radius: 10px;
        transition: all ease .3s;
        box-shadow: gray 1px 1px 4px, gray -1px -1px 4px, ;
        cursor: default;
        overflow: hidden;

        @media (max-width: 301px) {
            left: -192px;
        }

        button{
            display: flex;
            text-decoration: none;
            cursor: pointer;
            font-size: 17px;
            border: none;
            font-weight: 400;
            gap: 5px;
            margin: 0;
            padding: 7px ;
            background: transparent;
            place-items: center;
            align-self: center;
            color: rgb(68, 66, 66);
            &:hover{
                background: var(--primary);
                color: white;
                img{
                    filter: brightness(500%);
                    
                }
            }
            &:focus-visible{
                border: none;
                outline: none;
            }
            &:focus{
                border: none;
                outline: none;
            }

        }

        a, i{
            display: flex;
            color: rgb(68, 66, 66);
            text-decoration: none;
            font-size: 17px;
            border: none;
            text-align: left;
            font-weight: 400;
            gap: 5px;
            place-items: center;
            align-self: center;
            // border: #EC3337 1px solid;

            img{
                top: 0;
                left: 0;
                width: 18px;
                fill: #EC3337;
                filter: grayscale(200%);
            }
        
            &:hover{
                color: #EC3337;
                img{
                    filter: grayscale(0%);
                    
                }
            }
        }


    }
    &:hover .avtadm-usersession{
        transform: scaleY(1);
        transition: all ease .3s;
    }

    &-box{
        border-top: rgba(128, 128, 128, 0.482) 1px solid; 
        border-bottom: rgba(128, 128, 128, 0.482) 1px solid; 
        padding: 15px 0;
        margin: 15px 0;
        display: grid;
        text-align: left;
        a{
            color: rgb(128, 125, 125);
            font-size: 16px;
        }
    }


    
    span{
        color: black;
        font-size: 18px;

    }

    img{
        width: 100%;
        @media (max-width: 920px) {
            width: 40px;
            height: 40px;
            margin: 0 auto;
        }
    }
}


.tumb{
    display: flex;
    gap: 3px;
    width: fit-content;
    position: relative;
    align-items: center;
    /* border: yellow 1px solid; */
    @media (max-width: 480px) {
        display: grid;
        gap: 1px;
        margin: 0;
    }

    &-default{
        position: relative;
        margin: auto;
        display: grid;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        align-items: center;
        strong{
            margin-top: 20px;
        }

    }
    
    span{
        color: black;
        font-size: 15px;
        strong{
            font-weight: 500;
            font-size: 11px;
        }
        @media (max-width: 500px) {
            
            strong{
                font-weight: 500;
                font-size: 15px;
            }
        }
        @media (max-width: 300px) {
            text-align: left;
            line-height: normal;
            strong{
                font-weight: 500;
                font-size: 10px;
            }
        }
    }

    img{
        height: 100%;
        @media (max-width: 500px) {
            width: 100%;
        }
    }
}

`
