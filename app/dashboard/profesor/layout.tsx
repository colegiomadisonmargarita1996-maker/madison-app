import { requireRole } from "@/lib/roleGuard";

export default async function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["profesor"]);
  return <>{children}</>;
}
