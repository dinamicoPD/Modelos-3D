'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

interface ModeloInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  modelPath: string;
  thumbnail?: string;
}

export default function ModelosPage() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState('');

  // Lista de modelos disponibles
  const modelos: ModeloInfo[] = [
    {
      id: 'robot',
      name: 'Robot Animado',
      description: 'Modelo 3D de un robot con animaciones básicas',
      category: 'Personajes',
      modelPath: '/models/robot.glb'
    },
    {
      id: 'caja',
      name: 'Caja Simple',
      description: 'Modelo 3D básico de una caja texturizada',
      category: 'Objetos',
      modelPath: '/models/box.glb'
    },
    {
      id: 'casa',
      name: 'Casa Moderna',
      description: 'Modelo 3D de una casa moderna con detalles',
      category: 'Arquitectura',
      modelPath: '/models/house.glb'
    },
    {
      id: 'coche',
      name: 'Automóvil',
      description: 'Modelo 3D de un automóvil deportivo',
      category: 'Vehículos',
      modelPath: '/models/car.glb'
    }
  ];

  // Obtener URL base automáticamente
  useState(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  });

  const generateModelUrl = (modelId: string) => {
    return `${baseUrl}/modelo/${modelId}`;
  };

  const generateQRForModel = async (modelo: ModeloInfo) => {
    const url = generateModelUrl(modelo.id);
    
    try {
      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: `Modelo 3D: ${modelo.name}`,
          contenido: url,
          descripcion: `${modelo.description} - Categoría: ${modelo.category}`,
          categoria_id: null // Puedes agregar categorías específicas para modelos 3D
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Código QR generado exitosamente para ${modelo.name}`);
        // Redirigir a la página del QR generado
        window.location.href = `/qr/${data.data.id}`;
      } else {
        alert('Error generando código QR: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al generar código QR');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Modelos 3D</h1>
              <p className="text-gray-600">Gestiona y genera códigos QR para modelos 3D</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/qr/crear"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Crear QR Manual
              </Link>
              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">¿Cómo funciona?</h2>
          <p className="text-blue-800 text-sm">
            Selecciona un modelo 3D y genera un código QR que permitirá a los usuarios visualizar el modelo 
            en sus dispositivos móviles. Los modelos se cargan directamente en el navegador usando WebGL.
          </p>
        </div>

        {/* Lista de modelos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modelos.map((modelo) => (
            <div key={modelo.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Placeholder para thumbnail */}
                <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-4xl">🎯</div>
                </div>

                {/* Información del modelo */}
                <h3 className="font-semibold text-gray-900 mb-2">{modelo.name}</h3>
                
                <div className="flex items-center mb-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  <span className="text-sm text-gray-600">{modelo.category}</span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{modelo.description}</p>

                {/* URL del modelo */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">URL del modelo:</p>
                  <p className="text-xs text-blue-600 break-all bg-gray-50 p-2 rounded">
                    {generateModelUrl(modelo.id)}
                  </p>
                </div>

                {/* Acciones */}
                <div className="space-y-2">
                  <Link
                    href={`/modelo/${modelo.id}`}
                    className="w-full bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors text-center block"
                  >
                    👁️ Ver Modelo 3D
                  </Link>
                  
                  <button
                    onClick={() => generateQRForModel(modelo)}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    📱 Generar Código QR
                  </button>

                  <button
                    onClick={() => setSelectedModel(selectedModel === modelo.id ? null : modelo.id)}
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {selectedModel === modelo.id ? '🔼 Ocultar QR' : '🔽 Vista Previa QR'}
                  </button>
                </div>

                {/* Vista previa del QR */}
                {selectedModel === modelo.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                    <QRCodeSVG
                      value={generateModelUrl(modelo.id)}
                      size={120}
                      level="M"
                      includeMargin={true}
                      className="mx-auto mb-2"
                    />
                    <p className="text-xs text-gray-600">Vista previa del código QR</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Agregar Nuevos Modelos</h2>
          <div className="prose text-gray-600">
            <p className="mb-4">
              Para agregar nuevos modelos 3D al sistema:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Coloca tu archivo GLB en el directorio <code className="bg-gray-100 px-2 py-1 rounded">public/models/</code></li>
              <li>Actualiza la lista de modelos en <code className="bg-gray-100 px-2 py-1 rounded">app/modelo/[id]/page.tsx</code></li>
              <li>Agrega la entrada correspondiente en esta página</li>
              <li>Opcionalmente, crea una categoría específica para modelos 3D</li>
            </ol>
            <p className="mt-4 text-sm">
              <strong>Formatos soportados:</strong> GLB (recomendado), GLTF<br/>
              <strong>Tamaño máximo recomendado:</strong> 10MB por modelo
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}