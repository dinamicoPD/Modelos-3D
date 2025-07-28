import mysql from 'mysql2/promise';

/**
 * Configuración de la base de datos para XAMPP
 * Ajusta estos valores según tu configuración local
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // XAMPP por defecto no tiene contraseña para root
  database: process.env.DB_NAME || 'visor_qr',
  charset: 'utf8mb4'
};

/**
 * Pool de conexiones para mejor rendimiento y manejo de múltiples conexiones simultáneas
 * Se crea una sola vez y se reutiliza en toda la aplicación
 */
let pool: mysql.Pool | null = null;

/**
 * Obtiene o crea el pool de conexiones a la base de datos
 * Implementa el patrón Singleton para evitar múltiples pools
 * @returns Pool de conexiones MySQL
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true, // Espera conexiones disponibles en lugar de fallar
      connectionLimit: 10, // Máximo 10 conexiones simultáneas
      queueLimit: 0, // Sin límite en la cola de espera
    });

    // Manejar eventos del pool para debugging (opcional)
    try {
      pool.on('connection', (connection) => {
        console.log('Nueva conexión establecida como id ' + connection.threadId);
      });
    } catch (error) {
      // Ignorar errores de eventos si no están disponibles
      console.warn('No se pudieron configurar eventos del pool:', error);
    }
  }
  return pool;
}

/**
 * Ejecuta una consulta SQL con parámetros preparados
 * Previene inyección SQL usando prepared statements
 * @param query - Consulta SQL con placeholders (?)
 * @param params - Parámetros para la consulta
 * @returns Resultado de la consulta
 */
export async function executeQuery(query: string, params: unknown[] = []) {
  try {
    const pool = getPool();
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Error ejecutando consulta:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Cierra el pool de conexiones de forma segura
 * Útil para cleanup en tests o al cerrar la aplicación
 */
export async function closePool(): Promise<void> {
  if (pool) {
    try {
      await pool.end();
      console.log('Pool de conexiones cerrado correctamente');
    } catch (error) {
      console.error('Error cerrando pool de conexiones:', error);
    } finally {
      pool = null;
    }
  }
}

/**
 * Verifica la conectividad con la base de datos
 * Útil para health checks y diagnósticos
 * @returns Promise<boolean> - true si la conexión es exitosa
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await executeQuery('SELECT 1 as test');
    return Array.isArray(result) && result.length > 0;
  } catch (error) {
    console.error('Error probando conexión:', error);
    return false;
  }
}

// ============================================================================
// TIPOS TYPESCRIPT PARA LAS TABLAS DE LA BASE DE DATOS
// ============================================================================

/**
 * Interfaz para la tabla 'categorias'
 * Representa una categoría para organizar códigos QR
 */
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  color: string; // Color hexadecimal (#RRGGBB)
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

/**
 * Interfaz para la tabla 'qr_codes'
 * Representa un código QR almacenado en el sistema
 */
export interface QRCode {
  id: number;
  titulo: string;
  descripcion?: string;
  contenido: string; // El texto/URL que contiene el QR
  categoria_id?: number;
  imagen_path?: string; // Ruta relativa a la imagen generada
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  categoria?: {
    id: number;
    nombre: string;
    color: string;
  }; // Información de categoría cuando se hace JOIN
}

/**
 * Tipo para estadísticas de códigos QR por categoría
 */
export interface EstadisticaCategoria {
  categoria_id: number;
  categoria_nombre: string;
  categoria_color: string;
  total_qrs: number;
}

// ============================================================================
// CLASE DE SERVICIOS PARA LA BASE DE DATOS
// ============================================================================

/**
 * Clase que encapsula todas las operaciones de base de datos
 * Implementa el patrón Repository para separar la lógica de datos
 */
export class DatabaseService {
  
  // ========================================================================
  // MÉTODOS PARA GESTIÓN DE CATEGORÍAS
  // ========================================================================

  /**
   * Obtiene todas las categorías ordenadas alfabéticamente
   * @returns Promise<Categoria[]> - Lista de todas las categorías
   */
  static async getCategorias(): Promise<Categoria[]> {
    const query = 'SELECT * FROM categorias ORDER BY nombre ASC';
    return await executeQuery(query) as Categoria[];
  }

  /**
   * Crea una nueva categoría en la base de datos
   * @param nombre - Nombre único de la categoría
   * @param descripcion - Descripción opcional de la categoría
   * @param color - Color hexadecimal (por defecto: #3B82F6)
   * @returns Promise<number> - ID de la categoría creada
   * @throws Error si el nombre ya existe (violación de UNIQUE constraint)
   */
  static async createCategoria(nombre: string, descripcion?: string, color?: string): Promise<number> {
    const query = 'INSERT INTO categorias (nombre, descripcion, color) VALUES (?, ?, ?)';
    const result = await executeQuery(query, [nombre, descripcion || null, color || '#3B82F6']) as mysql.ResultSetHeader;
    return result.insertId;
  }

  /**
   * Actualiza una categoría existente
   * @param id - ID de la categoría a actualizar
   * @param nombre - Nuevo nombre de la categoría
   * @param descripcion - Nueva descripción (opcional)
   * @param color - Nuevo color hexadecimal (opcional)
   * @throws Error si el nombre ya existe en otra categoría
   */
  static async updateCategoria(id: number, nombre: string, descripcion?: string, color?: string): Promise<void> {
    const query = 'UPDATE categorias SET nombre = ?, descripcion = ?, color = ? WHERE id = ?';
    await executeQuery(query, [nombre, descripcion || null, color || '#3B82F6', id]);
  }

  /**
   * Elimina una categoría de la base de datos
   * IMPORTANTE: Esto pondrá categoria_id = NULL en todos los QRs asociados
   * debido a la constraint ON DELETE SET NULL
   * @param id - ID de la categoría a eliminar
   */
  static async deleteCategoria(id: number): Promise<void> {
    const query = 'DELETE FROM categorias WHERE id = ?';
    await executeQuery(query, [id]);
  }

  /**
   * Obtiene estadísticas de códigos QR por categoría
   * @returns Promise<EstadisticaCategoria[]> - Estadísticas por categoría
   */
  static async getEstadisticasCategorias(): Promise<EstadisticaCategoria[]> {
    const query = `
      SELECT
        c.id as categoria_id,
        c.nombre as categoria_nombre,
        c.color as categoria_color,
        COUNT(qr.id) as total_qrs
      FROM categorias c
      LEFT JOIN qr_codes qr ON c.id = qr.categoria_id
      GROUP BY c.id, c.nombre, c.color
      ORDER BY total_qrs DESC, c.nombre ASC
    `;
    return await executeQuery(query) as EstadisticaCategoria[];
  }

  // ========================================================================
  // MÉTODOS PARA GESTIÓN DE CÓDIGOS QR
  // ========================================================================

  /**
   * Obtiene códigos QR con información de categoría incluida
   * @param categoriaId - ID de categoría para filtrar (opcional)
   * @returns Promise<QRCode[]> - Lista de códigos QR con datos de categoría
   */
  static async getQRCodes(categoriaId?: number): Promise<QRCode[]> {
    // Construir consulta SQL con JOIN para obtener información de categoría
    let query = `
      SELECT qr.*, c.nombre as categoria_nombre, c.color as categoria_color
      FROM qr_codes qr
      LEFT JOIN categorias c ON qr.categoria_id = c.id
    `;
    const params: unknown[] = [];

    // Aplicar filtro por categoría si se especifica
    if (categoriaId) {
      query += ' WHERE qr.categoria_id = ?';
      params.push(categoriaId);
    }

    // Ordenar por fecha de creación (más recientes primero)
    query += ' ORDER BY qr.fecha_creacion DESC';
    
    const results = await executeQuery(query, params) as mysql.RowDataPacket[];
    
    // Mapear resultados de la base de datos a objetos QRCode
    return results.map(row => ({
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      contenido: row.contenido,
      categoria_id: row.categoria_id,
      imagen_path: row.imagen_path,
      fecha_creacion: row.fecha_creacion,
      fecha_actualizacion: row.fecha_actualizacion,
      // Incluir información de categoría si existe
      categoria: row.categoria_nombre ? {
        id: row.categoria_id,
        nombre: row.categoria_nombre,
        color: row.categoria_color
      } : undefined
    }));
  }

  /**
   * Obtiene un código QR específico por su ID
   * @param id - ID del código QR a buscar
   * @returns Promise<QRCode | null> - El código QR encontrado o null si no existe
   */
  static async getQRCodeById(id: number): Promise<QRCode | null> {
    const query = `
      SELECT qr.*, c.nombre as categoria_nombre, c.color as categoria_color
      FROM qr_codes qr
      LEFT JOIN categorias c ON qr.categoria_id = c.id
      WHERE qr.id = ?
    `;
    const results = await executeQuery(query, [id]) as mysql.RowDataPacket[];
    
    // Retornar null si no se encuentra el código QR
    if (results.length === 0) return null;
    
    const row = results[0];
    return {
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      contenido: row.contenido,
      categoria_id: row.categoria_id,
      imagen_path: row.imagen_path,
      fecha_creacion: row.fecha_creacion,
      fecha_actualizacion: row.fecha_actualizacion,
      // Incluir información de categoría si existe
      categoria: row.categoria_nombre ? {
        id: row.categoria_id,
        nombre: row.categoria_nombre,
        color: row.categoria_color
      } : undefined
    };
  }

  /**
   * Crea un nuevo código QR en la base de datos
   * @param titulo - Título descriptivo del código QR
   * @param contenido - Contenido que será codificado en el QR
   * @param descripcion - Descripción opcional del código QR
   * @param categoriaId - ID de la categoría (opcional)
   * @param imagenPath - Ruta de la imagen generada (opcional)
   * @returns Promise<number> - ID del código QR creado
   */
  static async createQRCode(
    titulo: string,
    contenido: string,
    descripcion?: string,
    categoriaId?: number,
    imagenPath?: string
  ): Promise<number> {
    const query = 'INSERT INTO qr_codes (titulo, descripcion, contenido, categoria_id, imagen_path) VALUES (?, ?, ?, ?, ?)';
    const result = await executeQuery(query, [
      titulo,
      descripcion || null,
      contenido,
      categoriaId || null,
      imagenPath || null
    ]) as mysql.ResultSetHeader;
    return result.insertId;
  }

  /**
   * Actualiza un código QR existente
   * @param id - ID del código QR a actualizar
   * @param titulo - Nuevo título
   * @param contenido - Nuevo contenido
   * @param descripcion - Nueva descripción (opcional)
   * @param categoriaId - Nueva categoría (opcional)
   * @param imagenPath - Nueva ruta de imagen (opcional)
   */
  static async updateQRCode(
    id: number,
    titulo: string,
    contenido: string,
    descripcion?: string,
    categoriaId?: number,
    imagenPath?: string
  ): Promise<void> {
    const query = 'UPDATE qr_codes SET titulo = ?, descripcion = ?, contenido = ?, categoria_id = ?, imagen_path = ? WHERE id = ?';
    await executeQuery(query, [
      titulo,
      descripcion || null,
      contenido,
      categoriaId || null,
      imagenPath || null,
      id
    ]);
  }

  /**
   * Elimina un código QR de la base de datos
   * IMPORTANTE: También debe eliminarse la imagen asociada del sistema de archivos
   * @param id - ID del código QR a eliminar
   */
  static async deleteQRCode(id: number): Promise<void> {
    const query = 'DELETE FROM qr_codes WHERE id = ?';
    await executeQuery(query, [id]);
  }

  // ========================================================================
  // MÉTODOS ADICIONALES PARA ESTADÍSTICAS Y UTILIDADES
  // ========================================================================

  /**
   * Cuenta el total de códigos QR en el sistema
   * @returns Promise<number> - Número total de códigos QR
   */
  static async getTotalQRCodes(): Promise<number> {
    const query = 'SELECT COUNT(*) as total FROM qr_codes';
    const result = await executeQuery(query) as mysql.RowDataPacket[];
    return result[0].total;
  }

  /**
   * Obtiene los códigos QR más recientes
   * @param limit - Número máximo de códigos QR a retornar (por defecto: 10)
   * @returns Promise<QRCode[]> - Lista de códigos QR más recientes
   */
  static async getRecentQRCodes(limit: number = 10): Promise<QRCode[]> {
    const query = `
      SELECT qr.*, c.nombre as categoria_nombre, c.color as categoria_color
      FROM qr_codes qr
      LEFT JOIN categorias c ON qr.categoria_id = c.id
      ORDER BY qr.fecha_creacion DESC
      LIMIT ?
    `;
    const results = await executeQuery(query, [limit]) as mysql.RowDataPacket[];
    
    return results.map(row => ({
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      contenido: row.contenido,
      categoria_id: row.categoria_id,
      imagen_path: row.imagen_path,
      fecha_creacion: row.fecha_creacion,
      fecha_actualizacion: row.fecha_actualizacion,
      categoria: row.categoria_nombre ? {
        id: row.categoria_id,
        nombre: row.categoria_nombre,
        color: row.categoria_color
      } : undefined
    }));
  }

  /**
   * Busca códigos QR por título o contenido
   * @param searchTerm - Término de búsqueda
   * @returns Promise<QRCode[]> - Lista de códigos QR que coinciden con la búsqueda
   */
  static async searchQRCodes(searchTerm: string): Promise<QRCode[]> {
    const query = `
      SELECT qr.*, c.nombre as categoria_nombre, c.color as categoria_color
      FROM qr_codes qr
      LEFT JOIN categorias c ON qr.categoria_id = c.id
      WHERE qr.titulo LIKE ? OR qr.contenido LIKE ? OR qr.descripcion LIKE ?
      ORDER BY qr.fecha_creacion DESC
    `;
    const searchPattern = `%${searchTerm}%`;
    const results = await executeQuery(query, [searchPattern, searchPattern, searchPattern]) as mysql.RowDataPacket[];
    
    return results.map(row => ({
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      contenido: row.contenido,
      categoria_id: row.categoria_id,
      imagen_path: row.imagen_path,
      fecha_creacion: row.fecha_creacion,
      fecha_actualizacion: row.fecha_actualizacion,
      categoria: row.categoria_nombre ? {
        id: row.categoria_id,
        nombre: row.categoria_nombre,
        color: row.categoria_color
      } : undefined
    }));
  }
}