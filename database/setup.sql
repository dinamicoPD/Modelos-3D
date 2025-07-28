-- Script de configuración para la base de datos del Visor de Códigos QR
-- Para usar con XAMPP MySQL

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS visor_qr CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE visor_qr;

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Color hexadecimal para la categoría
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de códigos QR
CREATE TABLE IF NOT EXISTS qr_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    contenido TEXT NOT NULL, -- El texto/URL que contiene el QR
    categoria_id INT,
    imagen_path VARCHAR(500), -- Ruta de la imagen del QR generado
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
    INDEX idx_categoria (categoria_id),
    INDEX idx_fecha_creacion (fecha_creacion)
);

-- Insertar categorías por defecto
INSERT INTO categorias (nombre, descripcion, color) VALUES
('General', 'Códigos QR generales sin categoría específica', '#6B7280'),
('URLs', 'Enlaces y páginas web', '#3B82F6'),
('Contacto', 'Información de contacto y vCards', '#10B981'),
('Texto', 'Texto plano y mensajes', '#F59E0B'),
('Redes Sociales', 'Enlaces a redes sociales', '#EF4444'),
('Eventos', 'Información de eventos y calendarios', '#8B5CF6'),
('WiFi', 'Configuraciones de redes WiFi', '#06B6D4'),
('Productos', 'Información de productos y códigos', '#84CC16')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Crear usuario para la aplicación (opcional, para mayor seguridad)
-- CREATE USER IF NOT EXISTS 'visor_qr_user'@'localhost' IDENTIFIED BY 'visor_qr_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON visor_qr.* TO 'visor_qr_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Mostrar las tablas creadas
SHOW TABLES;

-- Mostrar la estructura de las tablas
DESCRIBE categorias;
DESCRIBE qr_codes;