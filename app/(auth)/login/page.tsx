"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginWithEmail, getCurrentUser, getUserRole } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginWithEmail(email, password);
      const user = await getCurrentUser();
      const rol = user ? await getUserRole(user.id) : "padre";
      router.push(`/dashboard/${rol}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-azul-oscuro rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
            M
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Madison</h1>
          <p className="text-gray-600 mt-2">Plataforma Educativa</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingreso</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4"
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-6"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mb-4"
            disabled={loading}
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link href="/" className="text-azul-cielo hover:underline">
              Solicita información
            </Link>
          </p>
        </form>

        <div className="text-center mt-8">
          <Link href="/" className="text-azul-cielo hover:underline text-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
