import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// GET - Obtener código QR por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    const qrCode = await DatabaseService.getQRCodeById(id);
    
    if (!qrCode) {
      return NextResponse.json(
        { success: false, error: 'Código QR no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    console.error('Error obteniendo código QR:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}