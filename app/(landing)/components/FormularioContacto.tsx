"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialForm = {
  nombre: "",
  email: "",
  telefono: "",
  grado_interes: "",
  mensaje: "",
  consent: false,
};

export function FormularioContacto() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { consent, ...payload } = formData;
      void consent;

      const response = await fetch("/api/contactos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al enviar");
      }

      setSuccess(true);
      setFormData(initialForm);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Solicita Información
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-8 rounded-lg border border-gray-200"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Input
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Input
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Grado de interés
              </label>
              <select
                name="grado_interes"
                value={formData.grado_interes}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-cielo"
              >
                <option value="">Seleccionar...</option>
                <option value="1ro">1ro</option>
                <option value="2do">2do</option>
                <option value="3ro">3ro</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700">
              Mensaje
            </label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-cielo"
              placeholder="Cuéntanos sobre tu interés..."
            />
          </div>

          <div className="mb-6 flex items-start gap-2">
            <input
              type="checkbox"
              id="consent"
              required
              checked={formData.consent}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, consent: e.target.checked }))
              }
              className="mt-1"
            />
            <label htmlFor="consent" className="text-sm text-gray-600">
              Acepto que mis datos se usen conforme a la{" "}
              <Link href="/privacy" className="text-azul-cielo underline">
                política de privacidad
              </Link>
            </label>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
              ✓ Solicitud recibida. Nos contactaremos pronto.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
              ✕ {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Solicitud"}
          </Button>
        </form>
      </div>
    </section>
  );
}
