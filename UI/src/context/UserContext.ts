import { createContext } from "react";
import { User } from "../types/Index";

export const UserContext = createContext<User | undefined>(undefined);