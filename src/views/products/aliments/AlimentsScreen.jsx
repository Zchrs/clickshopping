import { CardProducts } from "../../../components/globals/CardProducts"
import {useLocation} from  'react-router-dom';
export const AlimentsScreen = () => {
  const location = useLocation();
  return (
    <section className="productscreen">
      <h2 className="productscreen-showroute"><span>{`home${location.pathname.replace(/\//g, ' > ')}`}</span></h2>
        <div className="productscreen-features">
          <h2>Alimentos</h2>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
            Eveniet odit similique perferendis maxime consequuntur nobis 
            laborum! Dolore saepe corrupti iure ut excepturi fuga accusamus 
            ipsam! Sint laboriosam voluptate cupiditate amet?</p>
        </div>
          <div className="productscreen-container">
            
            <div className="productscreen-contain">
              <h2>Legumbres</h2>
              <div className="productscreen-cards">
              <CardProducts
          addToWish={"addwishlist-red"}
          addTocart={"addcart-red"}
          img="tomates"
          description="Tomates frescos hidropóndico nacional de la más alta calidad, 100% orgánicos."
          title="Precio por 1kg"
          price="Cop $3.990 "
          previuosPrice="Cop $4.200"
          discount="5%"
          member="10% de descuento para miembros premium"
          jpg="true"
          classs={"productcard background"}
          buyCr={true}
        />
        <CardProducts
          addToWish={"addwishlist-red"}
          addTocart={"addcart-red"}
          img="cebolla"
          description="cebolla fresca hidropóndica nacional de la más alta calidad, 100% orgánica."
          title="Precio por 1kg"
          price="Cop $1.365"
          previuosPrice="Cop $1.440"
          discount="5%"
          member="10% de descuento para miembros premium"
          jpg="true"
          classs={"productcard background"}
          buyCr={true}
        />
        <CardProducts
          addToWish={"addwishlist-red"}
          addTocart={"addcart-red"}
          img="cebolla-larga"
          description="Cebolla larga hidropóndica nacional fresca de la más alta calidad, 100% orgánica."
          title="Precio por 1kg"
          price="Cop $2.850 "
          previuosPrice="Cop $3.000"
          discount="5%"
          member="10% de descuento para miembros premium"
          jpg="true"
          classs={"productcard background"}
          buyCr={true}
        />
        <CardProducts
          addToWish={"addwishlist-red"}
          addTocart={"addcart-red"}
          img="ajo"
          description="Ajo hidropóndico nacional fresco de la más alta calidad, 100% orgánico."
          title="Precio por 50gr"
          price="Cop $2.094"
          previuosPrice="Cop $2.250"
          discount="5%"
          member="10% de descuento para miembros premium"
          jpg="true"
          classs={"productcard background"}
          buyCr={true}
        />
        <CardProducts
          addToWish={"addwishlist-red"}
          addTocart={"addcart-red"}
          img="pimenton"
          description="Pimenton rojo hidropóndico nacional fresco de la más alta calidad, 100% orgánico."
          title="Precio por 1kg"
          price="Cop $2.280"
          previuosPrice="Cop $2.400"
          discount="5%"
          member="10% de descuento para miembros premium"
          jpg="true"
          classs={"productcard background"}
          buyCr={true}
        />
              </div>
            </div>
            <div className="productscreen-contain">
              <h2>Frutas</h2>
              <div className="productscreen-cards">
              <CardProducts
                addToWish={"addwishlist-red"}
                addTocart={"addcart-red"}
                img="manzana"
                description="Manzana roja de la más alta calidad, 100% orgánicas."
                title="Precio por 1kg"
                price="Cop $11.384"
                previuosPrice="Cop $11.984"
                discount="5%"
                member="10% de descuento para miembros premium"
                jpg="true"
                classs={"productcard background"}
                buyCr={true}
              />
      <CardProducts
      addToWish={"addwishlist-red"}
addTocart={"addcart-red"}
        img="banano"
        description="Bananos nacionales de la más alta calidad, 100% orgánicas."
        title="Precio por 1kg"
        price="Cop $2.850"
        previuosPrice="Cop $3.000"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg="true"
        classs={"productcard background"}
        buyCr={true}
      />
      <CardProducts
      addToWish={"addwishlist-red"}
addTocart={"addcart-red"}
        img="mora"
        description="Mora en bolsa nacional de la más alta calidad, 100% orgánicas."
        title="Precio por 1kg"
        price="Cop $12.144"
        previuosPrice="Cop $12.784"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg="true"
        classs={"productcard background"}
        buyCr={true}
      />
      <CardProducts
      addToWish={"addwishlist-red"}
addTocart={"addcart-red"}
        img="uvas"
        description="Uva nacional de la más alta calidad, 100% orgánicas."
        title="Precio por 1kg"
        price="Cop $6.840"
        previuosPrice="Cop $7.200"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg="true"
        classs={"productcard background"}
        buyCr={true}
      />
      <CardProducts
      addToWish={"addwishlist-red"}
addTocart={"addcart-red"}
        img="mango"
        description="Mango nacional de la más alta calidad, 100% orgánicos."
        title="Precio por 1kg"
        price="Cop $3.325"
        previuosPrice="Cop $3.500"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg="true"
        classs={"productcard background"}
        buyCr={true}
      />
              </div>
            </div>
            <div className="productscreen-contain">
              <h2>Granos</h2>
              <div className="productscreen-cards">
              <CardProducts
        addToWish={"addwishlist-red"}
        addTocart={"addcart-red"}
        img="frijol"
        description="Frijol rojo nacional de la más alta calidad, 100% orgánicos."
        title="Precio por 1kg"
        price="Cop $11.384"
        previuosPrice="Cop $11.984"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg="true"
        classs={"productcard background"}
        buyCr={true}
      />
      <CardProducts
        addToWish={"addwishlist-red"}
addTocart={"addcart-red"}
        img="garbanzo"
        description="Garbanzo nacionale de la más alta calidad, 100% orgánicos."
        title="Precio por 1kg"
        price="Cop $2.850"
        previuosPrice="Cop $3.000"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg="true"
        classs={"productcard background"}
        buyCr={true}
      />
      <CardProducts
        addToWish={"addwishlist-red"}
addTocart={"addcart-red"}
        img="lenteja"
        description="Lenteja en bolsa nacional de la más alta calidad, 100% orgánicas."
        title="Precio por 1kg"
        price="Cop $12.144"
        previuosPrice="Cop $12.784"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg="true"
        classs={"productcard background"}
        buyCr={true}
      />
      <CardProducts
        addToWish={"addwishlist-red"}
addTocart={"addcart-red"}
        img="arveja"
        description="Arveja nacional de la más alta calidad, 100% orgánica."
        title="Precio por 1kg"
        price="Cop $6.840"
        previuosPrice="Cop $7.200"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg="true"
        classs={"productcard background"}
        buyCr={true}
      />
      <CardProducts
        addToWish={"addwishlist-red"}
        addTocart={"addcart-red"}
        img="maiz"
        description="Maíz nacional de la más alta calidad, 100% orgánicos."
        title="Precio por 1kg"
        price="Cop $3.325"
        previuosPrice="Cop $3.500"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg="true"
        classs={"productcard background"}
        buyCr={true}
      />
              </div>
            </div>
            <div className="productscreen-contain">
              <h2>Especias</h2>
              <div className="productscreen-cards">
              <CardProducts
        addToWish={"addwishlist-red"}
addTocart={"addcart-red"}
        img1="laurel"
        description="Laurel fresco nacional hidropóndico de la más alta calidad, 100% orgánico."
        title="Precio por 1kg"
        price="Cop $11.384"
        previuosPrice="Cop $11.984"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg1="true"
        classs={"productcard background"}
        buyCr={true}
      />
      <CardProducts
        addToWish={"addwishlist-red"}
addTocart={"addcart-red"}
        img1="oregano"
        description="Orégano fresco nacional hidropóndico de la más alta calidad, 100% orgánicos."
        title="Precio por 1kg"
        price="Cop $2.850"
        previuosPrice="Cop $3.000"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg1="true"
        classs={"productcard background"}
        buyCr={true}
      />
      <CardProducts
        addToWish={"addwishlist-red"}
addTocart={"addcart-red"}
        img1="tomillo"
        description="Tomillo fresco nacional hidropóndico en bolsa nacional de la más alta calidad, 100% orgánicas."
        title="Precio por 1kg"
        price="Cop $12.144"
        previuosPrice="Cop $12.784"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg1="true"
        classs={"productcard background"}
        buyCr={true}
      />
      <CardProducts
        addToWish={"addwishlist-red"}
addTocart={"addcart-red"}
        img1="romero"
        description="Romero fresco hidropóndico nacional de la más alta calidad, 100% orgánica."
        title="Precio por 1kg"
        price="Cop $6.840"
        previuosPrice="Cop $7.200"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg1="true"
        classs={"productcard background"}
        buyCr={true}
      />
      <CardProducts
        addToWish={"addwishlist-red"}
        addTocart={"addcart-red"}
        img1="pimienta-negra"
        description="Pimienta negra hidropóndica nacional de la más alta calidad, 100% orgánicos."
        title="Precio por 1kg"
        price="Cop $3.325"
        previuosPrice="Cop $3.500"
        discount="5%"
        member="10% de descuento para miembros premium"
        jpg1="true"
        classs={"productcard background"}
        buyCr={true}
      />
              </div>
            </div>
          </div>
    </section>
  )
}
