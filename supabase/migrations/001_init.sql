-- Colegio Madison - Migración inicial
-- Tablas + RLS + índices

-- ============================================================
-- TABLAS
-- ============================================================

-- users: metadata adicional sobre auth.users (Supabase Auth maneja la autenticación)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR UNIQUE NOT NULL,
  nombre VARCHAR NOT NULL,
  rol VARCHAR NOT NULL CHECK (rol IN ('admin', 'profesor', 'padre', 'alumno')),
  estado VARCHAR NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.estudiantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  grado VARCHAR NOT NULL,
  seccion VARCHAR,
  padre_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.calificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID NOT NULL REFERENCES public.estudiantes(id),
  materia VARCHAR NOT NULL,
  profesor_id UUID NOT NULL REFERENCES public.users(id),
  nota DECIMAL(3,1) CHECK (nota >= 0 AND nota <= 20),
  comentario TEXT,
  trimestre VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID NOT NULL REFERENCES public.estudiantes(id),
  estado VARCHAR NOT NULL CHECK (estado IN ('pagado', 'moroso')),
  monto DECIMAL(10,2),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contactos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  telefono VARCHAR NOT NULL,
  grado_interes VARCHAR,
  mensaje TEXT,
  estado VARCHAR NOT NULL DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'inscrito')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.users(id),
  tabla VARCHAR NOT NULL,
  accion VARCHAR NOT NULL,
  datos_anteriores JSONB,
  datos_nuevos JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- updated_at automático
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_estudiantes
  BEFORE UPDATE ON public.estudiantes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_calificaciones
  BEFORE UPDATE ON public.calificaciones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Helper: rol del usuario autenticado (SECURITY DEFINER evita
-- recursión infinita al leer public.users desde sus propias policies)
-- ============================================================

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS VARCHAR AS $$
  SELECT rol FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- users: cada quien ve su propio registro; admin ve todos
CREATE POLICY "usuario_ve_su_registro" ON public.users
  FOR SELECT USING (id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "admin_gestiona_usuarios" ON public.users
  FOR ALL USING (public.current_user_role() = 'admin');

-- estudiantes: padre ve su hijo; profesor/admin ven todos (necesario para cargar notas)
CREATE POLICY "padre_ve_su_hijo" ON public.estudiantes
  FOR SELECT USING (padre_id = auth.uid());

CREATE POLICY "staff_ve_estudiantes" ON public.estudiantes
  FOR SELECT USING (public.current_user_role() IN ('profesor', 'admin'));

CREATE POLICY "admin_gestiona_estudiantes" ON public.estudiantes
  FOR ALL USING (public.current_user_role() = 'admin');

-- calificaciones: padre ve las de su hijo; profesor ve/crea/edita las suyas; admin todo
CREATE POLICY "padre_ve_calificaciones_su_hijo" ON public.calificaciones
  FOR SELECT USING (
    estudiante_id IN (SELECT id FROM public.estudiantes WHERE padre_id = auth.uid())
  );

CREATE POLICY "profesor_gestiona_sus_calificaciones" ON public.calificaciones
  FOR ALL USING (profesor_id = auth.uid());

CREATE POLICY "admin_gestiona_calificaciones" ON public.calificaciones
  FOR ALL USING (public.current_user_role() = 'admin');

-- pagos: padre ve pagos de su hijo; admin gestiona
CREATE POLICY "padre_ve_pagos_su_hijo" ON public.pagos
  FOR SELECT USING (
    estudiante_id IN (SELECT id FROM public.estudiantes WHERE padre_id = auth.uid())
  );

CREATE POLICY "admin_gestiona_pagos" ON public.pagos
  FOR ALL USING (public.current_user_role() = 'admin');

-- contactos: cualquiera (incluso anónimo) puede enviar el formulario de preinscripción;
-- solo admin puede leer/gestionar los leads
CREATE POLICY "publico_crea_contacto" ON public.contactos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_gestiona_contactos" ON public.contactos
  FOR ALL USING (public.current_user_role() = 'admin');

-- audit_logs: solo admin lee; los inserts se hacen con service_role (bypassa RLS)
CREATE POLICY "admin_ve_audit_logs" ON public.audit_logs
  FOR SELECT USING (public.current_user_role() = 'admin');

-- ============================================================
-- Índices
-- ============================================================

CREATE INDEX idx_estudiantes_padre_id ON public.estudiantes(padre_id);
CREATE INDEX idx_estudiantes_grado ON public.estudiantes(grado);
CREATE INDEX idx_calificaciones_profesor_id ON public.calificaciones(profesor_id);
CREATE INDEX idx_calificaciones_estudiante_id ON public.calificaciones(estudiante_id);
CREATE INDEX idx_calificaciones_trimestre ON public.calificaciones(trimestre);
CREATE INDEX idx_calificaciones_materia ON public.calificaciones(materia);
CREATE INDEX idx_pagos_estudiante_id ON public.pagos(estudiante_id);
CREATE INDEX idx_pagos_estado ON public.pagos(estado);
CREATE INDEX idx_contactos_email ON public.contactos(email);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_audit_logs_usuario_fecha ON public.audit_logs(usuario_id, created_at DESC);
