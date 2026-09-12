"use client";

import { useState } from "react";

export function Galeria() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Galería
        </h2>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
          {images.map((n) => (
            <div
              key={n}
              onClick={() => setSelectedImage(n)}
              className="cursor-pointer group relative overflow-hidden rounded-lg aspect-square bg-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-full h-full bg-gradient-to-br from-azul-cielo to-azul-oscuro flex items-center justify-center text-white text-sm font-medium">
                Foto {n}
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-screen">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ✕
              </button>
              <div className="bg-gray-200 w-96 h-96 rounded-lg flex items-center justify-center">
                Foto {selectedImage}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
