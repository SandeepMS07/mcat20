"use client";

import { usePathname } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

// /admin/login uses the bare provider so the user can authenticate; every
// other /admin/* route renders inside AdminShell (sidebar + topbar + logout).
export default function AdminShellOrLogin({ children }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#02103D] text-white">{children}</div>;
  }
  return <AdminShell>{children}</AdminShell>;
}
