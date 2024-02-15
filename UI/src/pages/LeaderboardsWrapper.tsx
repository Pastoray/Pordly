import UserContextProvider from "../context/UserContext"
import Leaderboards from "./Leaderboards"


function LeaderboardsWrapper() {
  return (
    <UserContextProvider>
        <Leaderboards/>
    </UserContextProvider>
  )
}

export default LeaderboardsWrapper