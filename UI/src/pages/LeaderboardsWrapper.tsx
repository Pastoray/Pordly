import UserContextProvider from "../context/UserContext"
import Leaderboards from "./LeaderBoards"


function LeaderboardsWrapper() {
  return (
    <UserContextProvider>
        <Leaderboards/>
    </UserContextProvider>
  )
}

export default LeaderboardsWrapper