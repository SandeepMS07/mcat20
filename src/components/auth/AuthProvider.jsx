"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getAccessToken,
  setAccessToken,
  registerAuthHandlers,
} from "@/app/api/turboverseAxios";
import {
  refreshSession,
  logoutSession,
} from "@/app/api/auth";
import { AuthContext } from "./AuthContext";
import LoginModal from "./LoginModal";

const USER_STORAGE = "mca_user";

const readStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_STORAGE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeStoredUser = (user) => {
  if (typeof window === "undefined") return;
  try {
    if (user) window.localStorage.setItem(USER_STORAGE, JSON.stringify(user));
    else window.localStorage.removeItem(USER_STORAGE);
  } catch {
    /* ignore */
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("fanPoll");
  const pendingActionRef = useRef(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedUser = readStoredUser();
    const storedToken = getAccessToken();
    if (storedUser) setUser(storedUser);
    if (storedToken) setTokenState(storedToken);
  }, []);

  const setAuth = useCallback(({ token: nextToken, user: nextUser }) => {
    setAccessToken(nextToken || null);
    setTokenState(nextToken || null);
    setUser(nextUser || null);
    writeStoredUser(nextUser || null);
  }, []);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setTokenState(null);
    setUser(null);
    writeStoredUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } catch {
      /* ignore network errors on logout */
    }
    clearAuth();
  }, [clearAuth]);

  // Register handlers used by the axios refresh-retry interceptor.
  useEffect(() => {
    registerAuthHandlers({
      onRefresh: async () => {
        try {
          const data = await refreshSession();
          if (data?.token) {
            setAccessToken(data.token);
            setTokenState(data.token);
            if (data.user) {
              setUser(data.user);
              writeStoredUser(data.user);
            }
            return data.token;
          }
          return null;
        } catch (err) {
          clearAuth();
          return null;
        }
      },
      onLogout: () => clearAuth(),
    });
  }, [clearAuth]);

  // Fire-and-forget refresh on mount to rotate the cookie and validate session.
  useEffect(() => {
    let cancelled = false;
    refreshSession()
      .then((data) => {
        if (cancelled || !data?.token) return;
        setAccessToken(data.token);
        setTokenState(data.token);
        if (data.user) {
          setUser(data.user);
          writeStoredUser(data.user);
        }
      })
      .catch(() => {
        // No refresh cookie or it's invalid — silently stay logged out.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openLogin = useCallback((onSuccess, options) => {
    pendingActionRef.current = typeof onSuccess === "function" ? onSuccess : null;
    setModalVariant(options?.variant || "fanPoll");
    setModalOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    pendingActionRef.current = null;
    setModalOpen(false);
  }, []);

  const handleLoginSuccess = useCallback(
    ({ token: nextToken, user: nextUser }) => {
      setAuth({ token: nextToken, user: nextUser });
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      setModalOpen(false);
      if (action) {
        try {
          action({ token: nextToken, user: nextUser });
        } catch (err) {
          console.error("[Auth] pending action failed:", err);
        }
      }
    },
    [setAuth]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthed: !!token,
      openLogin,
      logout,
    }),
    [user, token, openLogin, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal
        open={modalOpen}
        onClose={closeLogin}
        onSuccess={handleLoginSuccess}
        variant={modalVariant}
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
