// ============================================================================
// UTILIDADES DE CÓDIGOS QR PARA EL LADO DEL CLIENTE
// ============================================================================

/**
 * Niveles de corrección de errores disponibles:
 * - L: ~7% de corrección (Low)
 * - M: ~15% de corrección (Medium) - Recomendado para uso general
 * - Q: ~25% de corrección (Quartile) - Para entornos con posible daño
 * - H: ~30% de corrección (High) - Máxima resistencia a errores
 */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/**
 * Formatos de exportación soportados
 */
export type ExportFormat = 'png' | 'svg' | 'pdf';

/**
 * Opciones de personalización para la generación de códigos QR
 */
export interface QRGenerationOptions {
  width?: number; // Ancho personalizado en píxeles
  margin?: number; // Margen personalizado
  darkColor?: string; // Color personalizado para módulos oscuros
  lightColor?: string; // Color personalizado para fondo
  errorCorrectionLevel?: ErrorCorrectionLevel; // Nivel de corrección de errores
}

// ============================================================================
// FUNCIONES DE VALIDACIÓN Y UTILIDADES
// ============================================================================

/**
 * Valida el contenido de un código QR antes de generarlo
 * Verifica longitud y contenido básico
 * @param content - Contenido a validar
 * @returns Objeto con resultado de validación y mensaje de error si aplica
 */
export function validateQRContent(content: string): { isValid: boolean; error?: string } {
  // Verificar que no esté vacío
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: 'El contenido no puede estar vacío' };
  }
  
  // Verificar límite de caracteres (límite teórico de QR con corrección M)
  if (content.length > 2953) {
    return { isValid: false, error: 'El contenido es demasiado largo (máximo 2953 caracteres)' };
  }
  
  // Validación adicional: caracteres especiales problemáticos
  if (content.includes('\0')) {
    return { isValid: false, error: 'El contenido contiene caracteres no válidos' };
  }
  
  return { isValid: true };
}

/**
 * Detecta automáticamente el tipo de contenido basado en patrones comunes
 * Útil para categorización automática y UX mejorada
 * @param content - Contenido a analizar
 * @returns Tipo de contenido detectado como string
 */
export function detectContentType(content: string): string {
  const trimmedContent = content.trim().toLowerCase();
  
  // URLs (HTTP/HTTPS)
  if (trimmedContent.startsWith('http://') || trimmedContent.startsWith('https://')) {
    return 'URL';
  }
  
  // Email con protocolo mailto
  if (trimmedContent.startsWith('mailto:')) {
    return 'Email';
  }
  
  // Teléfono con protocolo tel
  if (trimmedContent.startsWith('tel:')) {
    return 'Teléfono';
  }
  
  // Configuración WiFi
  if (trimmedContent.startsWith('wifi:')) {
    return 'WiFi';
  }
  
  // SMS con protocolo sms
  if (trimmedContent.startsWith('sms:')) {
    return 'SMS';
  }
  
  // Geolocalización
  if (trimmedContent.startsWith('geo:')) {
    return 'Ubicación';
  }
  
  // vCard (contacto)
  if (trimmedContent.startsWith('begin:vcard') || trimmedContent.startsWith('vcard:')) {
    return 'Contacto';
  }
  
  // Email sin protocolo (contiene @ y punto)
  if (trimmedContent.includes('@') && trimmedContent.includes('.') && !trimmedContent.includes(' ')) {
    return 'Email';
  }
  
  // Número de teléfono (solo dígitos, espacios, guiones, paréntesis y +)
  if (/^\+?[\d\s\-\(\)]+$/.test(trimmedContent) && trimmedContent.replace(/\D/g, '').length >= 7) {
    return 'Teléfono';
  }
  
  // URL sin protocolo (contiene punto y no espacios)
  if (trimmedContent.includes('.') && !trimmedContent.includes(' ') && trimmedContent.length > 4) {
    return 'URL';
  }
  
  // Por defecto, es texto plano
  return 'Texto';
}

/**
 * Calcula el tamaño estimado del código QR basado en el contenido
 * Útil para mostrar advertencias al usuario sobre códigos muy densos
 * @param content - Contenido del QR
 * @param errorLevel - Nivel de corrección de errores
 * @returns Estimación del tamaño del QR (pequeño, mediano, grande, muy grande)
 */
export function estimateQRSize(content: string, errorLevel: ErrorCorrectionLevel = 'M'): string {
  const length = content.length;
  
  // Ajustar límites según nivel de corrección de errores
  const multiplier = { L: 1, M: 0.85, Q: 0.7, H: 0.6 }[errorLevel];
  const adjustedLength = length / multiplier;
  
  if (adjustedLength < 100) return 'Pequeño';
  if (adjustedLength < 500) return 'Mediano';
  if (adjustedLength < 1500) return 'Grande';
  return 'Muy Grande';
}