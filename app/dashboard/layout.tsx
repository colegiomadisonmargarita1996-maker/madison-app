import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
import { Sidebar } from "@/components/shared/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: perfil } = await supabase
    .from("users")
    .select("nombre, rol")
    .eq("id", user.id)
    .single();

  const userName = perfil?.nombre ?? user.email ?? "Usuario";
  const rol = perfil?.rol ?? "padre";

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar rol={rol} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar userName={userName} />
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
