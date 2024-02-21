import UserContextProvider from "../../context/UserContext"
import Profile from "../pages/Profile"

function ProfileWrapper() {
  return (
    <UserContextProvider>
        <Profile/>
    </UserContextProvider>
  )
}

export default ProfileWrapper