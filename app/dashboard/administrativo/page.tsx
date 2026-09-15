import { Card } from "@/components/ui/Card";

export default function AdministrativoDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
        <p className="text-gray-600 mt-2">Gestiona pagos y estado de morosidad</p>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acciones</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/dashboard/administrativo/pagos"
            className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
          >
            <p className="font-bold text-gray-900">💰 Gestionar Pagos</p>
            <p className="text-sm text-gray-600">Actualizar estado de pagos</p>
          </a>
        </div>
      </Card>
    </div>
  );
}
