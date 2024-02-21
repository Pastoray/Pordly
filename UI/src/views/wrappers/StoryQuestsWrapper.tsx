import StoryQuestsContextProvider from "../../context/StoryQuestsContext";
import UserContextProvider from "../../context/UserContext";
import StoryQuests from "../pages/StoryQuests";


function StoryQuestsWrapper() {
  return (
    <UserContextProvider>
        <StoryQuestsContextProvider>
            <StoryQuests/>
        </StoryQuestsContextProvider>
    </UserContextProvider>
  )
}

export default StoryQuestsWrapper