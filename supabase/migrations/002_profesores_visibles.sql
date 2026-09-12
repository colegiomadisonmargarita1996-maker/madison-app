-- Permite que cualquier usuario autenticado vea el perfil de los profesores
-- (necesario para mostrar el nombre del profesor en el join de calificaciones;
-- el nombre de un profesor no es informacion sensible)

CREATE POLICY "cualquiera_ve_profesores" ON public.users
  FOR SELECT USING (rol = 'profesor');
