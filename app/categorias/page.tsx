'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Categoria } from '@/lib/database';

export default function GestionarCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    color: '#3B82F6'
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/categorias');
      const data = await response.json();

      if (data.success) {
        setCategorias(data.data);
      } else {
        setError('Error cargando categorías');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error cargando categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const abrirFormulario = (categoria?: Categoria) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        color: categoria.color
      });
    } else {
      setEditingCategoria(null);
      setFormData({
        nombre: '',
        descripcion: '',
        color: '#3B82F6'
      });
    }
    setShowForm(true);
    setError(null);
  };

  const cerrarFormulario = () => {
    setShowForm(false);
    setEditingCategoria(null);
    setFormData({
      nombre: '',
      descripcion: '',
      color: '#3B82F6'
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    try {
      const url = '/api/categorias';
      const method = editingCategoria ? 'PUT' : 'POST';
      const body = editingCategoria 
        ? { ...formData, id: editingCategoria.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        await cargarCategorias();
        cerrarFormulario();
      } else {
        setError(data.error || 'Error guardando categoría');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error guardando categoría:', err);
    }
  };

  const eliminarCategoria = async (categoria: Categoria) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categorias?id=${categoria.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setCategorias(categorias.filter(c => c.id !== categoria.id));
      } else {
        alert('Error eliminando categoría: ' + data.error);
      }
    } catch (err) {
      alert('Error de conexión');
      console.error('Error eliminando categoría:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestionar Categorías</h1>
              <p className="text-gray-600">Organiza tus códigos QR por categorías</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => abrirFormulario()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Nueva Categoría
              </button>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error global */}
        {error && !showForm && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Formulario modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h2>
                  <button
                    onClick={cerrarFormulario}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: URLs, Contactos, Eventos..."
                      maxLength={100}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Descripción opcional de la categoría..."
                    />
                  </div>

                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="#3B82F6"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={cerrarFormulario}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {editingCategoria ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Lista de categorías */}
        {categorias.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay categorías</h3>
            <p className="text-gray-600 mb-6">Crea tu primera categoría para organizar tus códigos QR</p>
            <button
              onClick={() => abrirFormulario()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Crear primera categoría
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span
                        className="inline-block w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: categoria.color }}
                      ></span>
                      <h3 className="font-semibold text-gray-900">{categoria.nombre}</h3>
                    </div>
                  </div>

                  {categoria.descripcion && (
                    <p className="text-sm text-gray-600 mb-4">{categoria.descripcion}</p>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    <p>Creada: {new Date(categoria.fecha_creacion).toLocaleDateString('es-ES')}</p>
                    {categoria.fecha_actualizacion !== categoria.fecha_creacion && (
                      <p>Actualizada: {new Date(categoria.fecha_actualizacion).toLocaleDateString('es-ES')}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirFormulario(categoria)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarCategoria(categoria)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Eliminar
                    </button>
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