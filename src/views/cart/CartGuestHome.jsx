import { HeaderProducts } from "../../components/globals/HeaderProduct"
import { RouterGuest } from "../../router/AppRouter"


export const CartGuestHome = () => {
  return (
    <div>
        <HeaderProducts headClass={"headproducts blackhead"}/>
        <RouterGuest />
    </div>
  )
}
