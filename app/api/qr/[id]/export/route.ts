import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { exportQR } from '@/lib/qr-server-utils';
import { ExportFormat } from '@/lib/qr-client-utils';

// GET - Exportar código QR en formato específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') as ExportFormat;
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    if (!format || !['png', 'svg', 'pdf'].includes(format)) {
      return NextResponse.json(
        { success: false, error: 'Formato inválido. Use: png, svg, pdf' },
        { status: 400 }
      );
    }

    // Obtener código QR de la base de datos
    const qrCode = await DatabaseService.getQRCodeById(id);
    
    if (!qrCode) {
      return NextResponse.json(
        { success: false, error: 'Código QR no encontrado' },
        { status: 404 }
      );
    }

    // Opciones de personalización desde query params
    const width = searchParams.get('width') ? parseInt(searchParams.get('width')!) : undefined;
    const margin = searchParams.get('margin') ? parseInt(searchParams.get('margin')!) : undefined;
    const darkColor = searchParams.get('darkColor') || undefined;
    const lightColor = searchParams.get('lightColor') || undefined;
    const errorCorrectionLevel = searchParams.get('errorLevel') as 'L' | 'M' | 'Q' | 'H' || undefined;

    // Exportar código QR
    const exportResult = await exportQR(
      qrCode.contenido,
      format,
      qrCode.titulo,
      qrCode.descripcion,
      {
        width,
        margin,
        darkColor,
        lightColor,
        errorCorrectionLevel
      }
    );

    // Configurar headers para descarga
    const headers = new Headers();
    headers.set('Content-Type', exportResult.mimeType);
    headers.set('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
    headers.set('Content-Length', exportResult.buffer.length.toString());

    return new NextResponse(exportResult.buffer, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error exportando código QR:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}