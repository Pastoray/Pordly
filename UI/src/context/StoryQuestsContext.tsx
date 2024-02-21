import { createContext, useEffect, useState } from "react";
import { StoryQuest , ContextProviderProps } from "../types/Index";
import { get_story_quests } from "../utils/Index";

export const StoryQuestsContext = createContext<StoryQuest[] | undefined>(undefined);

function StoryQuestsContextProvider({ children }: ContextProviderProps) {
  const [storyQuests, setStoryQuests] = useState();

  useEffect(() => {
    async function fetch_story_quests() {
      try {
        const newStoryQuests = await get_story_quests();
        setStoryQuests(newStoryQuests);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetch_story_quests();
  }, []);

  return (
    <StoryQuestsContext.Provider value={storyQuests}>
      {children}
    </StoryQuestsContext.Provider>
  );
};

export default StoryQuestsContextProvider;