import { createContext } from "react";
import { IUserProfile } from "../utils/types/api.types";

interface AuthContextType {
  user: IUserProfile | null;
  getUser: () => Promise<IUserProfile | null>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
