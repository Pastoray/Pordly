import UserContextProvider from "../context/UserContext"
import Profile from "./Profile"

function ProfileWrapper() {
  return (
    <UserContextProvider>
        <Profile/>
    </UserContextProvider>
  )
}

export default ProfileWrapper