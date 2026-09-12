import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactoSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es requerido").max(200),
  email: z.string().trim().email("Email inválido"),
  telefono: z.string().trim().min(1, "El teléfono es requerido").max(50),
  grado_interes: z.string().trim().max(50).optional().or(z.literal("")),
  mensaje: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
        { status: 400 }
      );
    }

    const { nombre, email, telefono, grado_interes, mensaje } = parsed.data;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contactos")
      .insert([
        {
          nombre,
          email,
          telefono,
          grado_interes: grado_interes || null,
          mensaje: mensaje || null,
          estado: "nuevo",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "Solicitud guardada correctamente", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al guardar contacto:", error);
    return NextResponse.json(
      { error: "Error al guardar solicitud" },
      { status: 500 }
    );
  }
}
