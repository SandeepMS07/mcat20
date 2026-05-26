import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";
import AdminShellOrLogin from "./AdminShellOrLogin";

export const metadata = {
  title: "MCA Admin",
};

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminShellOrLogin>{children}</AdminShellOrLogin>
    </AdminAuthProvider>
  );
}
