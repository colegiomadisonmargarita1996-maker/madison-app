import { requireRole } from "@/lib/roleGuard";

export default async function ControlEstudiosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["control_estudios"]);
  return <>{children}</>;
}
