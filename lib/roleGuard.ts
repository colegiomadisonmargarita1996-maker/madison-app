import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Rol } from "@/types";

export async function requireRole(rolesPermitidos: Rol[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: perfil } = await supabase
    .from("users")
    .select("rol, estado")
    .eq("id", user.id)
    .single();

  const rol = perfil?.rol as Rol | undefined;

  if (!rol || perfil?.estado === "inactivo") {
    redirect("/login");
  }

  if (rol !== "admin" && !rolesPermitidos.includes(rol)) {
    redirect(`/dashboard/${rol}`);
  }

  return { rol, user };
}
