import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { promises as fs } from 'fs';
import path from 'path';
import { QRGenerationOptions, ExportFormat } from './qr-client-utils';

// ============================================================================
// CONFIGURACIÓN PARA CÓDIGOS QR
// ============================================================================

/**
 * Configuración por defecto para la generación de códigos QR
 * Estos valores proporcionan un balance entre calidad y tamaño
 */
export const QR_CONFIG = {
  errorCorrectionLevel: 'M' as const, // Nivel medio de corrección de errores (15%)
  type: 'png' as const, // Formato de imagen por defecto
  quality: 0.92, // Calidad de compresión (0-1)
  margin: 1, // Margen alrededor del código QR (en módulos)
  color: {
    dark: '#000000', // Color de los módulos oscuros (datos)
    light: '#FFFFFF' // Color de fondo (módulos claros)
  },
  width: 256 // Ancho en píxeles de la imagen generada
};

// ============================================================================
// FUNCIONES DE GENERACIÓN DE CÓDIGOS QR
// ============================================================================

/**
 * Genera un código QR como buffer PNG en memoria
 * Útil para guardar archivos o procesar la imagen directamente
 * @param text - Texto a codificar en el QR
 * @param options - Opciones de personalización
 * @returns Promise<Buffer> - Buffer con la imagen PNG del código QR
 */
export async function generateQRBuffer(
  text: string,
  options: QRGenerationOptions = {}
): Promise<Buffer> {
  // Combinar configuración por defecto con opciones personalizadas
  const config = {
    ...QR_CONFIG,
    width: options.width || QR_CONFIG.width,
    margin: options.margin || QR_CONFIG.margin,
    errorCorrectionLevel: options.errorCorrectionLevel || QR_CONFIG.errorCorrectionLevel,
    color: {
      dark: options.darkColor || QR_CONFIG.color.dark,
      light: options.lightColor || QR_CONFIG.color.light
    }
  };

  return await QRCode.toBuffer(text, config);
}

/**
 * Genera un código QR como string SVG
 * Ideal para mostrar en web o cuando se necesita escalabilidad vectorial
 * @param text - Texto a codificar en el QR
 * @param options - Opciones de personalización
 * @returns Promise<string> - String con el código SVG del QR
 */
export async function generateQRSVG(
  text: string,
  options: QRGenerationOptions = {}
): Promise<string> {
  const config = {
    ...QR_CONFIG,
    width: options.width || QR_CONFIG.width,
    margin: options.margin || QR_CONFIG.margin,
    errorCorrectionLevel: options.errorCorrectionLevel || QR_CONFIG.errorCorrectionLevel,
    color: {
      dark: options.darkColor || QR_CONFIG.color.dark,
      light: options.lightColor || QR_CONFIG.color.light
    }
  };

  return await QRCode.toString(text, { ...config, type: 'svg' });
}

/**
 * Genera un código QR como Data URL (base64)
 * Perfecto para mostrar directamente en elementos <img> del DOM
 * @param text - Texto a codificar en el QR
 * @param options - Opciones de personalización
 * @returns Promise<string> - Data URL con la imagen del código QR
 */
export async function generateQRDataURL(
  text: string,
  options: QRGenerationOptions = {}
): Promise<string> {
  const config = {
    width: options.width || QR_CONFIG.width,
    margin: options.margin || QR_CONFIG.margin,
    errorCorrectionLevel: options.errorCorrectionLevel || QR_CONFIG.errorCorrectionLevel,
    color: {
      dark: options.darkColor || QR_CONFIG.color.dark,
      light: options.lightColor || QR_CONFIG.color.light
    },
    type: 'image/png' as const // Especificar tipo para Data URL
  };

  return await QRCode.toDataURL(text, config);
}

// ============================================================================
// FUNCIONES DE ALMACENAMIENTO Y GESTIÓN DE ARCHIVOS
// ============================================================================

/**
 * Guarda un código QR como archivo PNG en el sistema de archivos
 * Crea automáticamente el directorio si no existe
 * @param text - Texto a codificar en el QR
 * @param filename - Nombre del archivo (debe incluir extensión .png)
 * @param options - Opciones de personalización del QR
 * @returns Promise<string> - Ruta relativa del archivo guardado (para usar en <img src="">)
 */
export async function saveQRImage(
  text: string,
  filename: string,
  options: QRGenerationOptions = {}
): Promise<string> {
  // Generar el buffer de la imagen
  const buffer = await generateQRBuffer(text, options);
  
  // Definir directorio de destino
  const publicDir = path.join(process.cwd(), 'public', 'qr-images');
  
  // Crear directorio si no existe (recursivo para crear subdirectorios)
  try {
    await fs.access(publicDir);
  } catch {
    await fs.mkdir(publicDir, { recursive: true });
  }

  // Escribir archivo al sistema de archivos
  const filePath = path.join(publicDir, filename);
  await fs.writeFile(filePath, buffer);
  
  // Retornar ruta relativa para uso en web
  return `/qr-images/${filename}`;
}

/**
 * Genera un documento PDF completo con código QR e información adicional
 * Incluye título, descripción, código QR, contenido y fecha de generación
 * @param text - Texto a codificar en el QR
 * @param title - Título del documento
 * @param description - Descripción opcional
 * @param options - Opciones de personalización del QR
 * @returns Promise<Buffer> - Buffer con el PDF generado
 */
export async function generateQRPDF(
  text: string,
  title: string,
  description?: string,
  options: QRGenerationOptions = {}
): Promise<Buffer> {
  // Generar código QR como Data URL para insertar en PDF
  const qrDataURL = await generateQRDataURL(text, { ...options, width: 200 });
  
  // Crear nuevo documento PDF
  const pdf = new jsPDF();
  
  // Configurar fuente por defecto
  pdf.setFont('helvetica');
  
  // Agregar título principal
  pdf.setFontSize(20);
  pdf.text(title, 20, 30);
  
  // Agregar descripción si existe
  if (description) {
    pdf.setFontSize(12);
    // Dividir texto largo en múltiples líneas
    const splitDescription = pdf.splitTextToSize(description, 170);
    pdf.text(splitDescription, 20, 45);
  }
  
  // Posicionar código QR (ajustar según si hay descripción)
  const qrY = description ? 70 : 50;
  pdf.addImage(qrDataURL, 'PNG', 20, qrY, 50, 50);
  
  // Agregar información del contenido del QR
  pdf.setFontSize(10);
  pdf.text('Contenido:', 80, qrY + 10);
  pdf.setFontSize(9);
  // Dividir contenido largo en múltiples líneas
  const splitContent = pdf.splitTextToSize(text, 110);
  pdf.text(splitContent, 80, qrY + 20);
  
  // Agregar fecha de generación
  pdf.setFontSize(8);
  pdf.text(`Generado el: ${new Date().toLocaleString('es-ES')}`, 20, qrY + 70);
  
  // Convertir PDF a Buffer para retorno
  return Buffer.from(pdf.output('arraybuffer'));
}

// ============================================================================
// FUNCIONES DE EXPORTACIÓN UNIFICADA
// ============================================================================

/**
 * Función principal para exportar códigos QR en diferentes formatos
 * Maneja la generación y preparación de archivos para descarga
 * @param text - Texto a codificar en el QR
 * @param format - Formato de exportación deseado
 * @param title - Título para el archivo y PDF
 * @param description - Descripción opcional (solo para PDF)
 * @param options - Opciones de personalización del QR
 * @returns Promise con buffer, tipo MIME y nombre de archivo
 */
export async function exportQR(
  text: string,
  format: ExportFormat,
  title: string,
  description?: string,
  options: QRGenerationOptions = {}
): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
  // Generar timestamp único para evitar colisiones de nombres
  const timestamp = Date.now();
  // Sanitizar título para uso seguro en nombres de archivo
  const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  
  switch (format) {
    case 'png':
      const pngBuffer = await generateQRBuffer(text, options);
      return {
        buffer: pngBuffer,
        mimeType: 'image/png',
        filename: `qr_${sanitizedTitle}_${timestamp}.png`
      };
      
    case 'svg':
      const svgString = await generateQRSVG(text, options);
      return {
        buffer: Buffer.from(svgString, 'utf8'),
        mimeType: 'image/svg+xml',
        filename: `qr_${sanitizedTitle}_${timestamp}.svg`
      };
      
    case 'pdf':
      const pdfBuffer = await generateQRPDF(text, title, description, options);
      return {
        buffer: pdfBuffer,
        mimeType: 'application/pdf',
        filename: `qr_${sanitizedTitle}_${timestamp}.pdf`
      };
      
    default:
      throw new Error(`Formato no soportado: ${format}`);
  }
}

// ============================================================================
// FUNCIONES DE GESTIÓN DE ARCHIVOS Y LIMPIEZA
// ============================================================================

/**
 * Elimina un archivo de imagen QR del sistema de archivos
 * Maneja errores de forma segura (no falla si el archivo no existe)
 * @param imagePath - Ruta relativa de la imagen (ej: "/qr-images/qr_123.png")
 */
export async function deleteQRImage(imagePath: string): Promise<void> {
  // Validar que se proporcione una ruta
  if (!imagePath) return;
  
  try {
    // Construir ruta completa del archivo
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    await fs.unlink(fullPath);
    console.log(`Imagen QR eliminada: ${imagePath}`);
  } catch (error) {
    console.error('Error eliminando imagen QR:', error);
    // No lanzar error si el archivo no existe - esto es intencional
    // para evitar fallos en cascada cuando se elimina un QR
  }
}

/**
 * Genera un nombre de archivo único para imágenes QR
 * Incluye timestamp para evitar colisiones
 * @param prefix - Prefijo opcional para el nombre
 * @returns Nombre de archivo único con extensión .png
 */
export function generateUniqueFilename(prefix: string = 'qr'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}.png`;
}