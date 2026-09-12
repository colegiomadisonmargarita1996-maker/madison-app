-- Permite upsert de calificaciones: una nota por estudiante+profesor+materia+trimestre
ALTER TABLE public.calificaciones
  ADD CONSTRAINT calificaciones_estudiante_profesor_materia_trimestre_key
  UNIQUE (estudiante_id, profesor_id, materia, trimestre);
