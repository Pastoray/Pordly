import UserContextProvider from "../../context/UserContext"
import UserProfile from "../pages/UserProfile"

function UserProfileWrapper() {
  return (
    <UserContextProvider>
        <UserProfile/>
    </UserContextProvider>
  )
}

export default UserProfileWrapper