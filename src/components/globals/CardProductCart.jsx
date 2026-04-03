/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styled from "styled-components"
import { formatPrice, getFile } from "../../../globalActions"


export const CardProductCart = ({ name, quantity, price, img, onRemove, color, onWishlist }) => {
  return (
    <ProductCartCard>
        <div className="cardproductcart">
            <div className="cardproductcart-left">
                <img src={img} alt="Product image" />
            </div>
            <div>
                <div className="cardproductcart-left-flex">
                    <div>
                        <h3>
                            {name}
                        </h3>
                    </div>
                    <div className="cardproductcart-icons">
                        <img onClick={onWishlist} src={getFile('svg', 'wishlist', 'svg')} alt="" />
                        <img onClick={onRemove} src={getFile('svg', 'trash', 'svg')} alt="" />
                    </div>
                </div>
            <div>
                <div className="cardproductcart-left-flex">
                    <div>
                        <h4>{formatPrice(price) }</h4>
                        <p>{color}</p>
                        <p>Envío: gratis</p>
                    </div>
                    <div>
                    <strong>{quantity}</strong>
                    </div>
                </div>
                    <div>
                        
                    </div>
                </div>
            </div>
        </div>
    </ProductCartCard>
  )
}

const ProductCartCard = styled.div`
    display: grid;

    .cardproductcart{
        display: grid;
        width: 100%;
        grid-template-columns: 15% 1fr;
        height: fit-content;
        /* background: white; */
        gap: 10px;
        align-items: center;

        h3{
            font-weight: 500;
            color: gray;
            font-size: 16px;
        }
        p{
            font-size: 14px;
            color: #c2c0c0;
        }

        &-left{
            position: relative;
            
            img{
                width: 100%;
            }
            
            &-flex{
            display: flex;
            justify-content: space-between;

        }

        }
        &-right{
            display: flex;
            border: yellow 1px solid;
        }
        &-icons{
            display: flex;
            gap: 15px;

            img{
                width: 15px;
                cursor: pointer;
                &:first-child{
                    width: 18px;
                    filter: invert(50%);
                }
            }
        }

    }
`
