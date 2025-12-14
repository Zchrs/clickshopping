/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom"
import { getFile } from "../../reducers/globalReducer"

import '../../assets/sass/menubottom.scss'


export const MenuBottom = ({
    icon, 
    icon1,
    icon2, 
    icon3, 
    icon4, 
    text, 
    text1, 
    text2, 
    text3, 
    text4
}) => {
  
  return (
    <div className="menubottom">
        <div className="menubottom-container">
            <div className="menubottom-itemss"><NavLink to={"/"}><i><img src={getFile('svg', `${icon}`, 'svg')} alt="" /></i><p>{text}</p></NavLink></div>
            <div className="menubottom-itemss"><NavLink><i><img src={getFile('svg', `${icon1}`, 'svg')} alt="" /></i><p>{text1}</p></NavLink></div>
            <div className="menubottom-itemss"><NavLink><i><img src={getFile('svg', `${icon2}`, 'svg')} alt="" /></i><p>{text2}</p></NavLink></div>
            <div className="menubottom-itemss"><NavLink><i><img src={getFile('svg', `${icon3}`, 'svg')} alt="" /></i><p>{text3}</p></NavLink></div>
            <div className="menubottom-itemss"><NavLink><i><img src={getFile('svg', `${icon4}`, 'svg')} alt="" /></i><p>{text4}</p></NavLink></div>
          </div>
    </div>
  )
}
