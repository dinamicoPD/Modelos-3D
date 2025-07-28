import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// GET - Obtener todas las categorías
export async function GET() {
  try {
    const categorias = await DatabaseService.getCategorias();
    
    return NextResponse.json({
      success: true,
      data: categorias
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva categoría
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, descripcion, color } = body;

    // Validaciones
    if (!nombre || nombre.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'El nombre de la categoría es requerido' },
        { status: 400 }
      );
    }

    if (nombre.length > 100) {
      return NextResponse.json(
        { success: false, error: 'El nombre de la categoría no puede exceder 100 caracteres' },
        { status: 400 }
      );
    }

    // Validar formato de color si se proporciona
    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return NextResponse.json(
        { success: false, error: 'El color debe estar en formato hexadecimal (#RRGGBB)' },
        { status: 400 }
      );
    }

    // Crear categoría
    const categoriaId = await DatabaseService.createCategoria(
      nombre.trim(),
      descripcion?.trim(),
      color
    );

    return NextResponse.json({
      success: true,
      data: { id: categoriaId },
      message: 'Categoría creada exitosamente'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando categoría:', error);
    
    // Manejar error de duplicado
    if (error instanceof Error && error.message.includes('Duplicate entry')) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una categoría con ese nombre' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar categoría
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nombre, descripcion, color } = body;

    // Validaciones
    if (!id || !nombre || nombre.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'ID y nombre son requeridos' },
        { status: 400 }
      );
    }

    if (nombre.length > 100) {
      return NextResponse.json(
        { success: false, error: 'El nombre de la categoría no puede exceder 100 caracteres' },
        { status: 400 }
      );
    }

    // Validar formato de color si se proporciona
    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return NextResponse.json(
        { success: false, error: 'El color debe estar en formato hexadecimal (#RRGGBB)' },
        { status: 400 }
      );
    }

    // Actualizar categoría
    await DatabaseService.updateCategoria(
      parseInt(id),
      nombre.trim(),
      descripcion?.trim(),
      color
    );

    return NextResponse.json({
      success: true,
      message: 'Categoría actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando categoría:', error);
    
    // Manejar error de duplicado
    if (error instanceof Error && error.message.includes('Duplicate entry')) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una categoría con ese nombre' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar categoría
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID es requerido' },
        { status: 400 }
      );
    }

    // Verificar si la categoría tiene códigos QR asociados
    const qrCodes = await DatabaseService.getQRCodes(parseInt(id));
    if (qrCodes.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `No se puede eliminar la categoría porque tiene ${qrCodes.length} código(s) QR asociado(s)` 
        },
        { status: 409 }
      );
    }

    // Eliminar categoría
    await DatabaseService.deleteCategoria(parseInt(id));

    return NextResponse.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando categoría:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}