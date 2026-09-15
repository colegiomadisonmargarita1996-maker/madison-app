import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/shared/DashboardShell";

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
    .select("nombre, rol, estado")
    .eq("id", user.id)
    .single();

  if (perfil?.estado === "inactivo") {
    await supabase.auth.signOut();
    redirect("/login");
  }

  const userName = perfil?.nombre ?? user.email ?? "Usuario";
  const rol = perfil?.rol ?? "padre";

  return (
    <DashboardShell userName={userName} rol={rol}>
      {children}
    </DashboardShell>
  );
}
