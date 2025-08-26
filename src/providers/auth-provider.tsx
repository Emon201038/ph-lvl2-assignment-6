import { useGetProfileQuery } from "@/redux/features/auth/authApi";
import type { ISession } from "@/types/auth";
import { createContext, useContext } from "react";

const authContext = createContext<ISession | null>(null);
null;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error, refetch } = useGetProfileQuery();

  return (
    <authContext.Provider value={{ data, isLoading, error, refetch }}>
      {children}
    </authContext.Provider>
  );
};

export default authContext;

export const useSession = () => {
  const value = useContext(authContext);
  if (!value) throw new Error("useSession must be used within a AuthProvider");
  return value;
};
