import { Card } from "@/components/ui/Card";

export default function ControlEstudiosDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Control de Estudios</h1>
        <p className="text-gray-600 mt-2">
          Consolida y corrige las calificaciones cargadas por los profesores
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acciones</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/dashboard/control_estudios/notas"
            className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
          >
            <p className="font-bold text-gray-900">📝 Notas por Grado</p>
            <p className="text-sm text-gray-600">Ver y corregir calificaciones</p>
          </a>
        </div>
      </Card>
    </div>
  );
}
