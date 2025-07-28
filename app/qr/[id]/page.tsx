'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { QRCode } from '@/lib/database';

interface Props {
  params: { id: string };
}

export default function DetalleQR({ params }: Props) {
  const router = useRouter();
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarQR();
  }, [params.id]);

  const cargarQR = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/qr/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setQrCode(data.data);
      } else {
        setError(data.error || 'Código QR no encontrado');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error cargando QR:', err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarQR = async () => {
    if (!qrCode || !confirm('¿Estás seguro de que quieres eliminar este código QR?')) {
      return;
    }

    try {
      const response = await fetch(`/api/qr?id=${qrCode.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/');
      } else {
        alert('Error eliminando código QR: ' + data.error);
      }
    } catch (err) {
      alert('Error de conexión');
      console.error('Error eliminando QR:', err);
    }
  };

  const descargarQR = async (formato: 'png' | 'svg' | 'pdf') => {
    if (!qrCode) return;

    try {
      const response = await fetch(`/api/qr/${qrCode.id}/export?format=${formato}`);
      
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

  const copiarContenido = async () => {
    if (!qrCode) return;

    try {
      await navigator.clipboard.writeText(qrCode.contenido);
      alert('Contenido copiado al portapapeles');
    } catch (err) {
      console.error('Error copiando al portapapeles:', err);
      alert('Error copiando al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando código QR...</p>
        </div>
      </div>
    );
  }

  if (error || !qrCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Código QR no encontrado'}</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{qrCode.titulo}</h1>
              <p className="text-gray-600">Detalles del código QR</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={`/qr/${qrCode.id}/editar`}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Editar
              </Link>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Código QR */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Código QR</h2>
            
            <div className="text-center mb-6">
              <div className="inline-block p-6 bg-white border-2 border-gray-200 rounded-lg">
                {qrCode.imagen_path ? (
                  <img
                    src={qrCode.imagen_path}
                    alt={`QR: ${qrCode.titulo}`}
                    className="w-64 h-64 object-contain"
                  />
                ) : (
                  <QRCodeSVG
                    value={qrCode.contenido}
                    size={256}
                    level="M"
                    includeMargin={true}
                  />
                )}
              </div>
            </div>

            {/* Opciones de descarga */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Descargar como:</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => descargarQR('png')}
                  className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg font-medium transition-colors text-center"
                >
                  PNG
                </button>
                <button
                  onClick={() => descargarQR('svg')}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-medium transition-colors text-center"
                >
                  SVG
                </button>
                <button
                  onClick={() => descargarQR('pdf')}
                  className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-lg font-medium transition-colors text-center"
                >
                  PDF
                </button>
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="space-y-6">
            {/* Detalles básicos */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <p className="text-gray-900">{qrCode.titulo}</p>
                </div>

                {qrCode.descripcion && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <p className="text-gray-900">{qrCode.descripcion}</p>
                  </div>
                )}

                {qrCode.categoria && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <div className="flex items-center">
                      <span
                        className="inline-block w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: qrCode.categoria.color }}
                      ></span>
                      <span className="text-gray-900">{qrCode.categoria.nombre}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-900 break-all">{qrCode.contenido}</p>
                    <button
                      onClick={copiarContenido}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      📋 Copiar contenido
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Creado</label>
                    <p className="text-gray-900">
                      {new Date(qrCode.fecha_creacion).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Actualizado</label>
                    <p className="text-gray-900">
                      {new Date(qrCode.fecha_actualizacion).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h2>
              
              <div className="space-y-3">
                <Link
                  href={`/qr/${qrCode.id}/editar`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center block"
                >
                  ✏️ Editar código QR
                </Link>
                
                <button
                  onClick={eliminarQR}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  🗑️ Eliminar código QR
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}