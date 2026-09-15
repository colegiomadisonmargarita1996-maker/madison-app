import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const notaSchema = z.object({
  estudiante_id: z.string().uuid(),
  materia: z.string().trim().min(1).max(100),
  nota: z.number().min(0).max(20),
  comentario: z.string().trim().max(500).optional().or(z.literal("")),
  trimestre: z.enum(["Trimestre I", "Trimestre II", "Trimestre III"]),
  profesor_id: z.string().uuid().optional(),
});

const bodySchema = z.object({
  calificaciones: z.array(notaSchema).min(1),
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

    const esProfesor = perfil?.rol === "profesor";
    const puedeAsignarProfesor = perfil?.rol === "admin" || perfil?.rol === "control_estudios";

    if (!esProfesor && !puedeAsignarProfesor) {
      return NextResponse.json({ error: "No tienes permiso" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
        { status: 400 }
      );
    }

    const rows = parsed.data.calificaciones.map((c) => ({
      estudiante_id: c.estudiante_id,
      // profesor: siempre su propio id (nunca confiar en el cliente).
      // admin/control_estudios: preservan el profesor_id original al
      // corregir una nota existente, o su propio id si es una nota nueva.
      profesor_id: esProfesor ? user.id : c.profesor_id ?? user.id,
      materia: c.materia,
      nota: c.nota,
      comentario: c.comentario || null,
      trimestre: c.trimestre,
    }));

    const { data, error } = await supabase
      .from("calificaciones")
      .upsert(rows, {
        onConflict: "estudiante_id,profesor_id,materia,trimestre",
      })
      .select();

    if (error) throw error;

    await supabase.from("audit_logs").insert([
      {
        usuario_id: user.id,
        tabla: "calificaciones",
        accion: "UPSERT",
        datos_nuevos: { count: rows.length, materia: rows[0]?.materia, trimestre: rows[0]?.trimestre },
      },
    ]);

    return NextResponse.json(
      { message: "Calificaciones guardadas", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al guardar calificaciones:", error);
    return NextResponse.json(
      { error: "Error al guardar calificaciones" },
      { status: 500 }
    );
  }
}
