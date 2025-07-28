'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ModelViewer from '@/components/ModelViewer';

interface Props {
  params: { id: string };
}

interface ModelData {
  id: string;
  name: string;
  description?: string;
  modelPath: string;
  category?: string;
}

export default function ModeloPage({ params }: Props) {
  const router = useRouter();
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarModelo();
  }, [params.id]);

  const cargarModelo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mapeo de modelos disponibles
      const modelos: Record<string, ModelData> = {
        'robot': {
          id: 'robot',
          name: 'Robot Animado',
          description: 'Modelo 3D de un robot con animaciones básicas',
          modelPath: '/models/robot.glb',
          category: 'Personajes'
        },
        'caja': {
          id: 'caja',
          name: 'Caja Simple',
          description: 'Modelo 3D básico de una caja texturizada',
          modelPath: '/models/box.glb',
          category: 'Objetos'
        },
        'casa': {
          id: 'casa',
          name: 'Casa Moderna',
          description: 'Modelo 3D de una casa moderna con detalles',
          modelPath: '/models/house.glb',
          category: 'Arquitectura'
        },
        'coche': {
          id: 'coche',
          name: 'Automóvil',
          description: 'Modelo 3D de un automóvil deportivo',
          modelPath: '/models/car.glb',
          category: 'Vehículos'
        }
      };

      const modelo = modelos[params.id.toLowerCase()];
      
      if (modelo) {
        setModelData(modelo);
      } else {
        setError('Modelo no encontrado');
      }
    } catch (err) {
      setError('Error cargando el modelo');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-white">Cargando modelo 3D...</p>
        </div>
      </div>
    );
  }

  if (error || !modelData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-300 mb-6">{error || 'Modelo no encontrado'}</p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{modelData.name}</h1>
              {modelData.description && (
                <p className="text-gray-300">{modelData.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {modelData.category && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {modelData.category}
                </span>
              )}
              <Link
                href="/"
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Visor 3D */}
      <main className="h-[calc(100vh-80px)]">
        <ModelViewer 
          modelPath={modelData.modelPath}
          title={modelData.name}
          description={modelData.description}
        />
      </main>

      {/* Footer con información */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg max-w-sm">
        <h3 className="font-semibold text-sm mb-1">Información del modelo</h3>
        <p className="text-xs opacity-90 mb-2">{modelData.description}</p>
        <p className="text-xs opacity-75">ID: {modelData.id}</p>
      </div>
    </div>
  );
}