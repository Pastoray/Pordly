import DailyQuestsContextProvider from "../context/DailyQuestsContext"
import StoryQuestsContextProvider from "../context/StoryQuestsContext"
import UserContextProvider from "../context/UserContext"
import LoadQuest from "./LoadQuest"


function LoadQuestWrapper() {
  return (
    <UserContextProvider>
        <StoryQuestsContextProvider>
            <DailyQuestsContextProvider>
                <LoadQuest/>
            </DailyQuestsContextProvider>
        </StoryQuestsContextProvider>
    </UserContextProvider>
  )
}

export default LoadQuestWrapper