import AchievementsContextProvider from "../context/AchievementsContext"
import UserContextProvider from "../context/UserContext"
import Achievements from "./Achievements"


function AchievementsWrapper() {
  return (
    <UserContextProvider>
      <AchievementsContextProvider>
        <Achievements/>
      </AchievementsContextProvider>
    </UserContextProvider>
  )
}

export default AchievementsWrapper