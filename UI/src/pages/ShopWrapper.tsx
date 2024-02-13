import UserContextProvider from "../context/UserContext"
import Shop from "./Shop"


function ShopWrapper() {
  return (
    <UserContextProvider>
        <Shop/>
    </UserContextProvider>
  )
}

export default ShopWrapper