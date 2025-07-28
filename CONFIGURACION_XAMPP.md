# Configuración de XAMPP para el Visor de Códigos QR

Esta guía te ayudará a configurar XAMPP correctamente para ejecutar el proyecto del Visor de Códigos QR.

## 📋 Requisitos

- XAMPP instalado (versión 8.0 o superior recomendada)
- Proyecto del Visor de Códigos QR descargado

## 🚀 Pasos de configuración

### 1. Iniciar XAMPP

1. Abre el Panel de Control de XAMPP
2. Inicia los servicios **Apache** y **MySQL**
3. Verifica que ambos servicios estén corriendo (indicador verde)

### 2. Acceder a phpMyAdmin

1. Abre tu navegador web
2. Ve a: `http://localhost/phpmyadmin`
3. Deberías ver la interfaz de phpMyAdmin

### 3. Crear la base de datos

#### Opción A: Usando phpMyAdmin (Interfaz gráfica)

1. En phpMyAdmin, haz clic en **"Nueva"** en el panel izquierdo
2. Nombre de la base de datos: `visor_qr`
3. Cotejamiento: `utf8mb4_unicode_ci`
4. Haz clic en **"Crear"**

#### Opción B: Usando SQL directo

1. En phpMyAdmin, haz clic en la pestaña **"SQL"**
2. Copia y pega el contenido completo del archivo `database/setup.sql`
3. Haz clic en **"Continuar"**

### 4. Verificar la instalación

Después de ejecutar el script SQL, deberías ver:

#### Tablas creadas:
- `categorias` - Para organizar los códigos QR
- `qr_codes` - Para almacenar los códigos QR

#### Datos iniciales:
- 8 categorías predefinidas (General, URLs, Contacto, etc.)

### 5. Configurar permisos (opcional)

Para mayor seguridad en producción, puedes crear un usuario específico:

```sql
CREATE USER 'visor_qr_user'@'localhost' IDENTIFIED BY 'tu_password_segura';
GRANT SELECT, INSERT, UPDATE, DELETE ON visor_qr.* TO 'visor_qr_user'@'localhost';
FLUSH PRIVILEGES;
```

Luego actualiza `lib/database.ts` con las nuevas credenciales.

## 🔧 Configuración del proyecto

### 1. Verificar configuración de base de datos

Abre el archivo `lib/database.ts` y verifica que la configuración coincida:

```typescript
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // XAMPP por defecto no tiene contraseña
  database: 'visor_qr',
  charset: 'utf8mb4'
};
```

### 2. Instalar dependencias del proyecto

```bash
cd visor-3d-qr
npm install
```

### 3. Ejecutar el proyecto

```bash
npm run dev
```

El proyecto estará disponible en: `http://localhost:3000`

## 🧪 Probar la conexión

### Verificar conexión a la base de datos

1. Abre `http://localhost:3000`
2. Si ves la página principal sin errores, la conexión es exitosa
3. Intenta crear una nueva categoría para probar la funcionalidad

### Verificar funcionalidades

1. **Crear categoría**: Ve a "Gestionar Categorías" → "Nueva Categoría"
2. **Crear código QR**: Ve a "Crear QR" y genera tu primer código
3. **Exportar**: Prueba descargar en diferentes formatos (PNG, SVG, PDF)

## 🐛 Solución de problemas comunes

### Error: "Connection refused"
- **Causa**: MySQL no está ejecutándose
- **Solución**: Inicia MySQL desde el panel de XAMPP

### Error: "Access denied for user 'root'"
- **Causa**: Credenciales incorrectas
- **Solución**: Verifica que la contraseña esté vacía o configura la correcta

### Error: "Database 'visor_qr' doesn't exist"
- **Causa**: La base de datos no se creó correctamente
- **Solución**: Ejecuta nuevamente el script `database/setup.sql`

### Error: "Table doesn't exist"
- **Causa**: Las tablas no se crearon
- **Solución**: Verifica que el script SQL se ejecutó completamente

### Puerto 3306 ocupado
- **Causa**: Otro servicio MySQL está corriendo
- **Solución**: 
  1. Detén otros servicios MySQL
  2. O cambia el puerto en XAMPP y actualiza `lib/database.ts`

### Error de permisos en directorio de imágenes
- **Causa**: Sin permisos de escritura en `public/qr-images/`
- **Solución**: El directorio se crea automáticamente, pero verifica permisos si es necesario

## 📊 Verificar datos en phpMyAdmin

### Ver categorías creadas:
```sql
SELECT * FROM categorias;
```

### Ver códigos QR creados:
```sql
SELECT qr.*, c.nombre as categoria_nombre 
FROM qr_codes qr 
LEFT JOIN categorias c ON qr.categoria_id = c.id 
ORDER BY qr.fecha_creacion DESC;
```

### Estadísticas:
```sql
SELECT 
    c.nombre as categoria,
    COUNT(qr.id) as total_qrs
FROM categorias c 
LEFT JOIN qr_codes qr ON c.id = qr.categoria_id 
GROUP BY c.id, c.nombre 
ORDER BY total_qrs DESC;
```

## 🔒 Configuración de seguridad (Producción)

Para un entorno de producción, considera:

1. **Cambiar credenciales por defecto**
2. **Crear usuario específico con permisos limitados**
3. **Configurar firewall para MySQL**
4. **Usar conexiones SSL**
5. **Configurar backups automáticos**

## 📞 Soporte

Si encuentras problemas:

1. Verifica que XAMPP esté actualizado
2. Revisa los logs de MySQL en XAMPP
3. Consulta la documentación oficial de XAMPP
4. Verifica que el puerto 3306 esté disponible

## ✅ Lista de verificación

- [ ] XAMPP instalado y funcionando
- [ ] Apache y MySQL iniciados
- [ ] Base de datos `visor_qr` creada
- [ ] Tablas `categorias` y `qr_codes` creadas
- [ ] Datos iniciales insertados
- [ ] Configuración en `lib/database.ts` correcta
- [ ] Dependencias del proyecto instaladas
- [ ] Proyecto ejecutándose en `http://localhost:3000`
- [ ] Funcionalidades básicas probadas

¡Una vez completada esta lista, tu Visor de Códigos QR estará listo para usar!