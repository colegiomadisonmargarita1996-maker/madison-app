import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const actualizarUsuarioSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es requerido").max(200).optional(),
  rol: z.enum(["admin", "profesor", "padre", "administrativo", "control_estudios"]).optional(),
  estado: z.enum(["activo", "inactivo"]).optional(),
});

export async function PATCH(
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

    const body = await request.json();
    const parsed = actualizarUsuarioSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
        { status: 400 }
      );
    }

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("users")
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await supabase.from("audit_logs").insert([
      {
        usuario_id: user.id,
        tabla: "users",
        accion: "UPDATE",
        datos_nuevos: { id, ...parsed.data },
      },
    ]);

    return NextResponse.json({ message: "Usuario actualizado", data }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}
