-- Reestructuración de roles: separa "admin" en Administrador de Sistema +
-- Administrativo (pagos) + Control de Estudios (notas). Elimina "alumno"
-- (rol de login sin usar, no confundir con la tabla estudiantes).

-- Verificación previa recomendada antes de correr esta migración:
--   SELECT conname FROM pg_constraint WHERE conrelid = 'public.users'::regclass AND contype = 'c';
--   SELECT count(*) FROM public.users WHERE rol = 'alumno'; -- debería dar 0

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_rol_check;
ALTER TABLE public.users ADD CONSTRAINT users_rol_check
  CHECK (rol IN ('admin', 'profesor', 'padre', 'administrativo', 'control_estudios'));

-- Cierra hueco de seguridad: esta política permitía a CUALQUIER usuario
-- autenticado (sin importar su rol real) insertar/editar calificaciones
-- auto-atribuidas, porque solo validaba profesor_id = auth.uid() sin
-- confirmar que ese usuario realmente fuera profesor.
DROP POLICY IF EXISTS "profesor_gestiona_sus_calificaciones" ON public.calificaciones;
CREATE POLICY "profesor_gestiona_sus_calificaciones" ON public.calificaciones
  FOR ALL USING (profesor_id = auth.uid() AND public.current_user_role() = 'profesor');

CREATE POLICY "control_estudios_gestiona_calificaciones" ON public.calificaciones
  FOR ALL USING (public.current_user_role() = 'control_estudios');

CREATE POLICY "administrativo_gestiona_pagos" ON public.pagos
  FOR ALL USING (public.current_user_role() = 'administrativo');

DROP POLICY IF EXISTS "staff_ve_estudiantes" ON public.estudiantes;
CREATE POLICY "staff_ve_estudiantes" ON public.estudiantes
  FOR SELECT USING (public.current_user_role() IN ('profesor', 'admin', 'administrativo', 'control_estudios'));
