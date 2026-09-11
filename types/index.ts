export type Rol = "admin" | "profesor" | "padre" | "alumno";

export type User = {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  estado: "activo" | "inactivo";
  created_at: string;
  updated_at: string;
};

export type Estudiante = {
  id: string;
  nombre: string;
  grado: string;
  seccion?: string | null;
  padre_id: string;
  created_at: string;
  updated_at: string;
};

export type Calificacion = {
  id: string;
  estudiante_id: string;
  materia: string;
  profesor_id: string;
  nota: number | null;
  comentario?: string | null;
  trimestre: string;
  created_at: string;
  updated_at: string;
};

export type Pago = {
  id: string;
  estudiante_id: string;
  estado: "pagado" | "moroso";
  monto: number | null;
  fecha_actualizacion: string;
  created_at: string;
};

export type Contacto = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  grado_interes?: string | null;
  mensaje?: string | null;
  estado: "nuevo" | "contactado" | "inscrito";
  created_at: string;
};
