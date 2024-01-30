import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getUser } from "../utils/Index";

export function useUser() {
    const [user, setUser] = useState(useContext(UserContext));
    getUser("accessToken").then((newUser) => {
    setUser(newUser)
  })

  return user;
}