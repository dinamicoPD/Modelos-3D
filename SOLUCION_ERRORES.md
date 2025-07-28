# 🔧 Solución de Errores Comunes - Visor de Códigos QR

Esta guía te ayudará a resolver los errores más comunes que puedes encontrar al usar el visor de códigos QR.

## 🚨 Errores de Base de Datos

### Error: "Connection refused" o "ECONNREFUSED"
**Causa**: MySQL no está ejecutándose o no está disponible en el puerto especificado.

**Solución**:
1. Abrir XAMPP Control Panel
2. Verificar que MySQL esté iniciado (botón "Start")
3. Si ya está iniciado, reiniciarlo (Stop → Start)
4. Verificar que el puerto 3306 esté libre

```bash
# Verificar si el puerto está en uso (Windows)
netstat -an | findstr :3306

# Verificar si MySQL está corriendo
tasklist | findstr mysql
```

### Error: "Access denied for user 'root'"
**Causa**: Credenciales incorrectas o usuario no existe.

**Solución**:
1. Verificar credenciales en `lib/database.ts`
2. Para XAMPP, el usuario por defecto es `root` sin contraseña
3. Si has cambiado la contraseña, actualizar en el archivo de configuración

```typescript
// En lib/database.ts
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Dejar vacío para XAMPP por defecto
  database: 'visor_qr'
};
```

### Error: "Database 'visor_qr' doesn't exist"
**Causa**: La base de datos no se ha creado.

**Solución**:
1. Ir a phpMyAdmin: `http://localhost/phpmyadmin`
2. Ejecutar el script completo de `database/setup.sql`
3. Verificar que se creó la base de datos `visor_qr`

### Error: "Table 'qr_codes' doesn't exist"
**Causa**: Las tablas no se crearon correctamente.

**Solución**:
1. Ejecutar nuevamente el script `database/setup.sql`
2. Verificar que se crearon las tablas:
   - `categorias`
   - `qr_codes`

## 🖼️ Errores de Imágenes

### Error: "ENOENT: no such file or directory, open 'public/qr-images/...'"
**Causa**: El directorio de imágenes no existe.

**Solución**:
```bash
# Crear directorio manualmente
mkdir public/qr-images
```

O el sistema lo creará automáticamente al generar el primer QR.

### Error: "Permission denied" al guardar imágenes
**Causa**: Sin permisos de escritura en el directorio.

**Solución**:
1. Verificar permisos del directorio `public/qr-images/`
2. En Windows, verificar que no esté marcado como "Solo lectura"
3. En sistemas Unix, ajustar permisos:

```bash
chmod 755 public/qr-images/
```

## 📦 Errores de Dependencias

### Error: "Module not found: Can't resolve 'qrcode'"
**Causa**: Dependencias no instaladas correctamente.

**Solución**:
```bash
# Reinstalar dependencias
npm install

# O instalar específicamente
npm install qrcode @types/qrcode
```

### Error: "Canvas is not supported"
**Causa**: Problemas con la librería canvas en algunos sistemas.

**Solución**:
```bash
# Reinstalar canvas
npm uninstall canvas
npm install canvas

# En Windows, puede requerir herramientas de compilación
npm install --global windows-build-tools
```

## 🌐 Errores de Red y API

### Error: "Failed to fetch" en las APIs
**Causa**: El servidor Next.js no está corriendo o hay problemas de red.

**Solución**:
1. Verificar que el servidor esté corriendo: `npm run dev`
2. Verificar que esté en el puerto correcto: `http://localhost:3000`
3. Revisar la consola del navegador para más detalles

### Error: "Internal Server Error" (500)
**Causa**: Error en el servidor, generalmente relacionado con la base de datos.

**Solución**:
1. Revisar logs en la consola del servidor
2. Verificar conexión a la base de datos
3. Verificar que las tablas existan y tengan la estructura correcta

## 🎨 Errores de Interfaz

### Error: "Hydration failed" en Next.js
**Causa**: Diferencias entre el renderizado del servidor y cliente.

**Solución**:
1. Verificar que no haya elementos que cambien entre servidor y cliente
2. Usar `useEffect` para código que solo debe ejecutarse en el cliente
3. Verificar que las fechas se formateen consistentemente

### Error: Estilos no se cargan correctamente
**Causa**: Problemas con Tailwind CSS o configuración.

**Solución**:
1. Verificar que Tailwind esté configurado correctamente
2. Reiniciar el servidor de desarrollo
3. Limpiar caché: `npm run build`

## 📱 Errores de Códigos QR

### Error: "Content too long" al generar QR
**Causa**: El contenido excede el límite de caracteres.

**Solución**:
1. Reducir el contenido (máximo 2953 caracteres)
2. Usar URLs acortadas para enlaces largos
3. Considerar usar nivel de corrección de errores más bajo (L en lugar de M)

### Error: QR generado pero no escaneable
**Causa**: Contenido malformado o caracteres especiales problemáticos.

**Solución**:
1. Verificar que el contenido no tenga caracteres de control
2. Para URLs, asegurar que tengan protocolo (`http://` o `https://`)
3. Probar con contenido más simple primero

## 🔄 Errores de Exportación

### Error: "jsPDF is not defined"
**Causa**: Problema con la librería de PDF.

**Solución**:
```bash
npm install jspdf html2canvas
```

### Error: PDF generado pero vacío
**Causa**: Problema con la generación del Data URL del QR.

**Solución**:
1. Verificar que el QR se genere correctamente primero
2. Revisar la función `generateQRDataURL`
3. Probar con contenido más simple

## 🔍 Herramientas de Diagnóstico

### Verificar estado del sistema
```bash
# Verificar que Node.js esté instalado
node --version

# Verificar que npm funcione
npm --version

# Verificar dependencias
npm list

# Verificar puertos en uso
netstat -an | findstr :3000
netstat -an | findstr :3306
```

### Verificar base de datos
```sql
-- En phpMyAdmin, ejecutar estas consultas para verificar
SHOW DATABASES;
USE visor_qr;
SHOW TABLES;
SELECT COUNT(*) FROM categorias;
SELECT COUNT(*) FROM qr_codes;
```

### Logs útiles
```javascript
// Agregar en lib/database.ts para debugging
console.log('Configuración DB:', dbConfig);

// Agregar en las APIs para debugging
console.log('Request body:', body);
console.log('Query result:', result);
```

## 🆘 Solución de Emergencia

Si nada funciona, seguir estos pasos:

1. **Reset completo**:
```bash
# Detener servidor
Ctrl+C

# Limpiar node_modules
rm -rf node_modules
rm package-lock.json

# Reinstalar todo
npm install

# Reiniciar servidor
npm run dev
```

2. **Reset de base de datos**:
   - Eliminar base de datos `visor_qr` en phpMyAdmin
   - Ejecutar nuevamente `database/setup.sql`

3. **Verificar configuración**:
   - Revisar `lib/database.ts`
   - Verificar que XAMPP esté corriendo
   - Probar conexión manual a MySQL

## 📞 Obtener Ayuda

Si el problema persiste:

1. **Revisar logs**: Consola del navegador y terminal del servidor
2. **Verificar versiones**: Node.js, npm, dependencias
3. **Probar en modo incógnito**: Para descartar problemas de caché
4. **Crear issue**: Con información detallada del error y pasos para reproducir

## 🔧 Comandos Útiles de Emergencia

```bash
# Limpiar todo y empezar de nuevo
npm run build
rm -rf .next
npm run dev

# Verificar configuración de Next.js
npm run build 2>&1 | grep -i error

# Verificar TypeScript
npx tsc --noEmit

# Verificar ESLint
npm run lint
```

¡Con esta guía deberías poder resolver la mayoría de problemas que encuentres!