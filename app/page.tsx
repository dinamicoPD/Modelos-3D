'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCode, Categoria } from '@/lib/database';

export default function Home() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, [categoriaSeleccionada]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar categorías
      const categoriasResponse = await fetch('/api/categorias');
      const categoriasData = await categoriasResponse.json();
      
      if (categoriasData.success) {
        setCategorias(categoriasData.data);
      }

      // Cargar códigos QR
      const qrUrl = categoriaSeleccionada 
        ? `/api/qr?categoria=${categoriaSeleccionada}`
        : '/api/qr';
      
      const qrResponse = await fetch(qrUrl);
      const qrData = await qrResponse.json();
      
      if (qrData.success) {
        setQrCodes(qrData.data);
      } else {
        setError('Error cargando códigos QR');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarQR = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este código QR?')) {
      return;
    }

    try {
      const response = await fetch(`/api/qr?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        setQrCodes(qrCodes.filter(qr => qr.id !== id));
      } else {
        alert('Error eliminando código QR: ' + data.error);
      }
    } catch (err) {
      alert('Error de conexión');
      console.error('Error eliminando QR:', err);
    }
  };

  const descargarQR = async (id: number, formato: 'png' | 'svg' | 'pdf') => {
    try {
      const response = await fetch(`/api/qr/${id}/export?format=${formato}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `qr.${formato}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error descargando archivo');
      }
    } catch (err) {
      alert('Error de conexión');
      console.error('Error descargando QR:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Visor de Códigos QR</h1>
              <p className="text-gray-600">Genera, almacena y gestiona tus códigos QR</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/qr/crear"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Crear QR
              </Link>
              <Link
                href="/modelos"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Modelos 3D
              </Link>
              <Link
                href="/categorias"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Gestionar Categorías
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoriaSeleccionada(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoriaSeleccionada === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Todas las categorías
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => setCategoriaSeleccionada(categoria.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoriaSeleccionada === categoria.id
                    ? 'text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: categoriaSeleccionada === categoria.id ? categoria.color : undefined
                }}
              >
                {categoria.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Lista de códigos QR */}
        {qrCodes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📱</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay códigos QR</h3>
            <p className="text-gray-600 mb-6">
              {categoriaSeleccionada 
                ? 'No hay códigos QR en esta categoría'
                : 'Comienza creando tu primer código QR'
              }
            </p>
            <Link
              href="/qr/crear"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Crear primer QR
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {qrCodes.map((qr) => (
              <div key={qr.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Imagen QR */}
                  <div className="flex justify-center mb-4">
                    {qr.imagen_path ? (
                      <img
                        src={qr.imagen_path}
                        alt={`QR: ${qr.titulo}`}
                        className="w-32 h-32 object-contain"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  {/* Información */}
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{qr.titulo}</h3>
                  
                  {qr.categoria && (
                    <div className="flex items-center mb-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: qr.categoria.color }}
                      ></span>
                      <span className="text-sm text-gray-600">{qr.categoria.nombre}</span>
                    </div>
                  )}

                  {qr.descripcion && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{qr.descripcion}</p>
                  )}

                  <p className="text-xs text-gray-500 mb-4">
                    Creado: {new Date(qr.fecha_creacion).toLocaleDateString('es-ES')}
                  </p>

                  {/* Acciones */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/qr/${qr.id}`}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                    >
                      Ver detalles
                    </Link>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => descargarQR(qr.id, 'png')}
                        className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                        title="Descargar PNG"
                      >
                        PNG
                      </button>
                      <button
                        onClick={() => descargarQR(qr.id, 'pdf')}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                        title="Descargar PDF"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => eliminarQR(qr.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
