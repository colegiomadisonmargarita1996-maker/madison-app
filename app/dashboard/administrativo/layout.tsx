import { requireRole } from "@/lib/roleGuard";

export default async function AdministrativoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["administrativo"]);
  return <>{children}</>;
}
