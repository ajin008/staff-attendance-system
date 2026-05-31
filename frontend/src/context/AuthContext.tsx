"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { User } from "../types";
import { logoutUser } from "../services/auth.service";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(parsedUser);
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
  };

  const logout = async () => {
    await logoutUser();

    localStorage.removeItem("user");

    setUser(null);

    console.log("logout completed");

    window.location.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
