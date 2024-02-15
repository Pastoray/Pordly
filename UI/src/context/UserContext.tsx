import { createContext, useEffect, useState } from "react";
import { User, ContextProviderProps } from "../types/Index";
import { getUser } from "../utils/Index";

export const UserContext = createContext<User | null | undefined>(undefined);

function UserContextProvider({ children }: ContextProviderProps) {
  const [user, setUser] = useState<User | null | undefined>();

  useEffect(() => {
    async function fetch_user() {
      try {
        const newUser = await getUser();
        setUser(newUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetch_user();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;