'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { Categoria } from '@/lib/database';
import { detectContentType, validateQRContent } from '@/lib/qr-client-utils';

export default function CrearQR() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    descripcion: '',
    categoria_id: ''
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewQR, setPreviewQR] = useState(false);

  // Cargar categorías
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      const data = await response.json();
      
      if (data.success) {
        setCategorias(data.data);
      }
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.titulo.trim()) {
      setError('El título es requerido');
      return;
    }

    if (!formData.contenido.trim()) {
      setError('El contenido es requerido');
      return;
    }

    const validation = validateQRContent(formData.contenido);
    if (!validation.isValid) {
      setError(validation.error || 'Contenido inválido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: formData.titulo.trim(),
          contenido: formData.contenido.trim(),
          descripcion: formData.descripcion.trim() || undefined,
          categoria_id: formData.categoria_id ? parseInt(formData.categoria_id) : undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/qr/${data.data.id}`);
      } else {
        setError(data.error || 'Error creando código QR');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error creando QR:', err);
    } finally {
      setLoading(false);
    }
  };

  const tipoContenido = formData.contenido ? detectContentType(formData.contenido) : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crear Código QR</h1>
              <p className="text-gray-600">Genera un nuevo código QR personalizado</p>
            </div>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Mi sitio web, Información de contacto..."
                  maxLength={255}
                  required
                />
              </div>

              {/* Contenido */}
              <div>
                <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido del QR *
                </label>
                <textarea
                  id="contenido"
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: https://mi-sitio.com, +57 300 123 4567, Hola mundo..."
                  maxLength={2953}
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    {tipoContenido && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tipoContenido}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.contenido.length}/2953 caracteres
                  </p>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descripción adicional del código QR..."
                />
              </div>

              {/* Categoría */}
              <div>
                <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría (opcional)
                </label>
                <select
                  id="categoria_id"
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sin categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPreviewQR(!previewQR)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  disabled={!formData.contenido.trim()}
                >
                  {previewQR ? 'Ocultar vista previa' : 'Vista previa'}
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.titulo.trim() || !formData.contenido.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Creando...' : 'Crear código QR'}
                </button>
              </div>
            </form>
          </div>

          {/* Vista previa */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista previa</h3>
            
            {formData.contenido.trim() && previewQR ? (
              <div className="text-center">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <QRCodeSVG
                    value={formData.contenido}
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Título:</strong> {formData.titulo || 'Sin título'}</p>
                  {formData.descripcion && (
                    <p className="mt-1"><strong>Descripción:</strong> {formData.descripcion}</p>
                  )}
                  <p className="mt-1"><strong>Tipo:</strong> {tipoContenido || 'Texto'}</p>
                  {formData.categoria_id && (
                    <p className="mt-1">
                      <strong>Categoría:</strong> {
                        categorias.find(c => c.id === parseInt(formData.categoria_id))?.nombre || 'Desconocida'
                      }
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">📱</div>
                <p>Ingresa el contenido y haz clic en "Vista previa" para ver el código QR</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}