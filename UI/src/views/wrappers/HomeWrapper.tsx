import AchievementsContextProvider from "../../context/AchievementsContext"
import DailyQuestsContextProvider from "../../context/DailyQuestsContext"
import StoryQuestsContextProvider from "../../context/StoryQuestsContext"
import UserContextProvider from "../../context/UserContext"
import Home from "../pages/Home"


function HomeWrapper() {
  return (
    <UserContextProvider>
        <StoryQuestsContextProvider>
            <DailyQuestsContextProvider>
              <AchievementsContextProvider>
                <Home/>
              </AchievementsContextProvider>
            </DailyQuestsContextProvider>
        </StoryQuestsContextProvider>
    </UserContextProvider>
  )
}

export default HomeWrapper