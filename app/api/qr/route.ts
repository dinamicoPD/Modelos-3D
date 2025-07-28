import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { saveQRImage, deleteQRImage, generateUniqueFilename } from '@/lib/qr-server-utils';
import { validateQRContent } from '@/lib/qr-client-utils';

// GET - Obtener todos los códigos QR
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriaId = searchParams.get('categoria');
    
    const qrCodes = await DatabaseService.getQRCodes(
      categoriaId ? parseInt(categoriaId) : undefined
    );
    
    return NextResponse.json({
      success: true,
      data: qrCodes
    });
  } catch (error) {
    console.error('Error obteniendo códigos QR:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo código QR
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, contenido, descripcion, categoria_id } = body;

    // Validaciones
    if (!titulo || !contenido) {
      return NextResponse.json(
        { success: false, error: 'Título y contenido son requeridos' },
        { status: 400 }
      );
    }

    // Validar contenido del QR
    const validation = validateQRContent(contenido);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Generar nombre único para la imagen
    const timestamp = Date.now();
    const filename = `qr_${timestamp}.png`;

    // Guardar imagen del QR
    const imagePath = await saveQRImage(contenido, filename);

    // Guardar en base de datos
    const qrId = await DatabaseService.createQRCode(
      titulo,
      contenido,
      descripcion,
      categoria_id || null,
      imagePath
    );

    // Obtener el QR creado con información completa
    const newQR = await DatabaseService.getQRCodeById(qrId);

    return NextResponse.json({
      success: true,
      data: newQR,
      message: 'Código QR creado exitosamente'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando código QR:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar código QR existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, titulo, contenido, descripcion, categoria_id } = body;

    // Validaciones
    if (!id || !titulo || !contenido) {
      return NextResponse.json(
        { success: false, error: 'ID, título y contenido son requeridos' },
        { status: 400 }
      );
    }

    // Validar contenido del QR
    const validation = validateQRContent(contenido);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Obtener QR existente
    const existingQR = await DatabaseService.getQRCodeById(id);
    if (!existingQR) {
      return NextResponse.json(
        { success: false, error: 'Código QR no encontrado' },
        { status: 404 }
      );
    }

    let imagePath = existingQR.imagen_path;

    // Si el contenido cambió, generar nueva imagen
    if (existingQR.contenido !== contenido) {
      // Eliminar imagen anterior
      if (existingQR.imagen_path) {
        await deleteQRImage(existingQR.imagen_path);
      }

      // Generar nueva imagen
      const timestamp = Date.now();
      const filename = `qr_${timestamp}.png`;
      imagePath = await saveQRImage(contenido, filename);
    }

    // Actualizar en base de datos
    await DatabaseService.updateQRCode(
      id,
      titulo,
      contenido,
      descripcion,
      categoria_id || null,
      imagePath
    );

    // Obtener el QR actualizado
    const updatedQR = await DatabaseService.getQRCodeById(id);

    return NextResponse.json({
      success: true,
      data: updatedQR,
      message: 'Código QR actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando código QR:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar código QR
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

    // Obtener QR para eliminar imagen
    const existingQR = await DatabaseService.getQRCodeById(parseInt(id));
    if (!existingQR) {
      return NextResponse.json(
        { success: false, error: 'Código QR no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar imagen si existe
    if (existingQR.imagen_path) {
      await deleteQRImage(existingQR.imagen_path);
    }

    // Eliminar de base de datos
    await DatabaseService.deleteQRCode(parseInt(id));

    return NextResponse.json({
      success: true,
      message: 'Código QR eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando código QR:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}