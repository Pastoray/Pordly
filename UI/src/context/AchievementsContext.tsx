import { createContext, useEffect, useState } from "react";
import { Achievement, ContextProviderProps } from "../types/Index";
import { get_achievements } from "../utils/Index";


export const AchievementsContext = createContext<Achievement[] | undefined>(undefined);

function AchievementsContextProvider({ children }: ContextProviderProps) {
  const [achievements, setAchievements] = useState<Achievement[]>();
  
  useEffect(() => {
    async function fetch_achievements() {
        try {
            const new_achievements = await get_achievements();
        setAchievements(new_achievements);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    fetch_achievements();
  }, []);

  return (
    <AchievementsContext.Provider value={achievements}>
      {children}
    </AchievementsContext.Provider>
  );
};

export default AchievementsContextProvider;