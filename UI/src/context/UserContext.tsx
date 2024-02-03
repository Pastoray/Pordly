import { createContext, useEffect, useState } from "react";
import { User, ContextProviderProps } from "../types/Index";
import { getUser } from "../utils/Index";

export const UserContext = createContext<User | undefined>(undefined);

function UserContextProvider({ children }: ContextProviderProps) {
  const [user, setUser] = useState();

  useEffect(() => {
    async function fetchUser() {
      try {
        const newUser = await getUser();
        setUser(newUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;