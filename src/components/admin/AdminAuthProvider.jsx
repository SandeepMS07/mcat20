"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminLogout, adminMe } from "@/app/api/admin-auth";

// Admin auth context — bootstraps on mount via /v1/admin/me, keeps a single
// adminUser value the rest of the admin shell reads from.

const AdminAuthCtx = createContext({
  adminUser: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await adminMe();
      setAdminUser(data?.adminUser ?? null);
    } catch {
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await adminLogout();
    } catch {
      /* idempotent backend; ignore */
    }
    setAdminUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  }, []);

  return (
    <AdminAuthCtx.Provider value={{ adminUser, loading, refresh, logout }}>
      {children}
    </AdminAuthCtx.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthCtx);
}
