import { createContext, useEffect, useState } from "react";
import { DailyQuest, ContextProviderProps } from "../types/Index";
import { get_daily_quests } from "../utils/Index";


export const DailyQuestsContext = createContext<DailyQuest[] | undefined>(undefined);

function DailyQuestsContextProvider({ children }: ContextProviderProps) {
  const [dailyQuests, setDailyQuests] = useState();
  
  useEffect(() => {
    async function fetch_daily_quests() {
      try {
        const newDailyQuests = await get_daily_quests();
        setDailyQuests(newDailyQuests);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetch_daily_quests();
  }, []);

  return (
    <DailyQuestsContext.Provider value={dailyQuests}>
      {children}
    </DailyQuestsContext.Provider>
  );
};

export default DailyQuestsContextProvider;