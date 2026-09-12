import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const pagoSchema = z.object({
  estudiante_id: z.string().uuid(),
  estado: z.enum(["pagado", "moroso"]),
  monto: z.number().min(0).optional(),
});

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
    const parsed = pagoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
        { status: 400 }
      );
    }

    const { estudiante_id, estado, monto } = parsed.data;

    const { data, error } = await supabase
      .from("pagos")
      .insert([{ estudiante_id, estado, monto }])
      .select()
      .single();

    if (error) throw error;

    await supabase.from("audit_logs").insert([
      {
        usuario_id: user.id,
        tabla: "pagos",
        accion: "INSERT",
        datos_nuevos: { estudiante_id, estado, monto },
      },
    ]);

    return NextResponse.json({ message: "Pago actualizado", data }, { status: 201 });
  } catch (error) {
    console.error("Error al actualizar pago:", error);
    return NextResponse.json(
      { error: "Error al actualizar pago" },
      { status: 500 }
    );
  }
}
