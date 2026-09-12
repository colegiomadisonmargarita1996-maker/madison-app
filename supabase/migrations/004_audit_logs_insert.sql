-- Permite que un usuario autenticado registre auditoria de sus propias acciones
CREATE POLICY "usuario_inserta_su_audit_log" ON public.audit_logs
  FOR INSERT WITH CHECK (usuario_id = auth.uid());
