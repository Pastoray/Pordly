import { createContext, useEffect, useState } from "react";
import { StoryQuests, ContextProviderProps } from "../types/Index";
import { getStoryQuests } from "../utils/Index";

export const StoryQuestsContext = createContext<StoryQuests | undefined>(undefined);

function StoryQuestsContextProvider({ children }: ContextProviderProps) {
  const [storyQuests, setStoryQuests] = useState();

  useEffect(() => {
    async function fetchStoryQuests() {
      try {
        const newStoryQuests = await getStoryQuests();
        setStoryQuests(newStoryQuests);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchStoryQuests();
  }, []);

  return (
    <StoryQuestsContext.Provider value={storyQuests}>
      {children}
    </StoryQuestsContext.Provider>
  );
};

export default StoryQuestsContextProvider;