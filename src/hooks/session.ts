import authContext from "@/providers/auth-provider";
import { useContext } from "react";

export const useSession = () => {
  const value = useContext(authContext);
  return value;
};
