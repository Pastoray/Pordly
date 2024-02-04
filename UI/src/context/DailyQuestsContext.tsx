import { createContext, useEffect, useState } from "react";
import { DailyQuests, ContextProviderProps } from "../types/Index";
import { getDailyQuests } from "../utils/Index";


export const DailyQuestsContext = createContext<DailyQuests | undefined>(undefined);

function DailyQuestsContextProvider({ children }: ContextProviderProps) {
  const [dailyQuests, setDailyQuests] = useState();
  
  useEffect(() => {
    async function fetchDailyQuests() {
      try {
        const newDailyQuests = await getDailyQuests();
        setDailyQuests(newDailyQuests);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchDailyQuests();
  }, []);

  return (
    <DailyQuestsContext.Provider value={dailyQuests}>
      {children}
    </DailyQuestsContext.Provider>
  );
};

export default DailyQuestsContextProvider;