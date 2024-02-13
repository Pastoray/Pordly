import UserContextProvider from "../context/UserContext"
import Achievements from "./Achievements"


function AchievementsWrapper() {
  return (
    <UserContextProvider>
        <Achievements/>
    </UserContextProvider>
  )
}

export default AchievementsWrapper