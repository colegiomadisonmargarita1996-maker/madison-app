import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

const usuarioSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es requerido").max(200),
  email: z.string().trim().email("Email inválido"),
  rol: z.enum(["admin", "profesor", "padre", "administrativo", "control_estudios"]),
});

function generarPasswordTemporal() {
  return crypto.randomBytes(9).toString("base64").replace(/[/+=]/g, "");
}

export async function POST(request: NextRequest) {
  try {
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
    const parsed = usuarioSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
        { status: 400 }
      );
    }

    const { nombre, email, rol } = parsed.data;
    const adminClient = createAdminClient();
    const passwordTemporal = generarPasswordTemporal();

    const { data: nuevoAuthUser, error: authError } =
      await adminClient.auth.admin.createUser({
        email,
        password: passwordTemporal,
        email_confirm: true,
        user_metadata: { nombre },
      });

    if (authError) {
      const mensaje = authError.message.includes("already been registered")
        ? "Ya existe un usuario con ese correo"
        : authError.message;
      return NextResponse.json({ error: mensaje }, { status: 400 });
    }

    const { error: perfilError } = await adminClient.from("users").insert([
      {
        id: nuevoAuthUser.user.id,
        email,
        nombre,
        rol,
        estado: "activo",
      },
    ]);

    if (perfilError) {
      await adminClient.auth.admin.deleteUser(nuevoAuthUser.user.id);
      throw perfilError;
    }

    await supabase.from("audit_logs").insert([
      {
        usuario_id: user.id,
        tabla: "users",
        accion: "INSERT",
        datos_nuevos: { email, nombre, rol },
      },
    ]);

    return NextResponse.json(
      {
        message: "Usuario creado correctamente",
        usuario: { id: nuevoAuthUser.user.id, email, nombre, rol },
        passwordTemporal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}
