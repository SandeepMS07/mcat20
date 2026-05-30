"use client";
import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthed: false,
  openLogin: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);
