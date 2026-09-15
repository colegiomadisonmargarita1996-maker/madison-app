import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function generarPasswordTemporal() {
  return crypto.randomBytes(9).toString("base64").replace(/[/+=]/g, "");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { data: perfil } = await supabase
      .from("users")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (perfil?.rol !== "admin") {
      return NextResponse.json({ error: "No tienes permiso" }, { status: 403 });
    }

    const adminClient = createAdminClient();
    const passwordTemporal = generarPasswordTemporal();

    const { error } = await adminClient.auth.admin.updateUserById(id, {
      password: passwordTemporal,
    });

    if (error) throw error;

    await supabase.from("audit_logs").insert([
      {
        usuario_id: user.id,
        tabla: "users",
        accion: "RESET_PASSWORD",
        datos_nuevos: { id },
      },
    ]);

    return NextResponse.json({ passwordTemporal }, { status: 200 });
  } catch (error) {
    console.error("Error al resetear contraseña:", error);
    return NextResponse.json(
      { error: "Error al resetear contraseña" },
      { status: 500 }
    );
  }
}
