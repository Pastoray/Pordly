import UserContextProvider from "../../context/UserContext"
import Leaderboards from "../pages/Leaderboards"


function LeaderboardsWrapper() {
  return (
    <UserContextProvider>
        <Leaderboards/>
    </UserContextProvider>
  )
}

export default LeaderboardsWrapper