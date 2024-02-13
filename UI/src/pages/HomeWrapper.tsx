import DailyQuestsContextProvider from "../context/DailyQuestsContext"
import StoryQuestsContextProvider from "../context/StoryQuestsContext"
import UserContextProvider from "../context/UserContext"
import Home from "./Home"


function HomeWrapper() {
  return (
    <UserContextProvider>
        <StoryQuestsContextProvider>
            <DailyQuestsContextProvider>
                <Home/>
            </DailyQuestsContextProvider>
        </StoryQuestsContextProvider>
    </UserContextProvider>
  )
}

export default HomeWrapper