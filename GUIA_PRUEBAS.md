# 🧪 Guía de Pruebas Reales - Visor de Códigos QR

Esta guía te llevará paso a paso para realizar pruebas completas del sistema.

## 📋 Preparación inicial

### 1. Verificar que XAMPP esté funcionando
```bash
# Abrir XAMPP Control Panel
# Verificar que Apache y MySQL estén en verde (Running)
```

### 2. Configurar la base de datos
1. Ve a: http://localhost/phpmyadmin
2. Ejecuta el script SQL completo desde `database/setup.sql`
3. Verifica que se crearon las tablas `categorias` y `qr_codes`

### 3. Iniciar el proyecto
```bash
cd visor-3d-qr
npm run dev
```

### 4. Verificar que el proyecto esté corriendo
- Abre: http://localhost:3000
- Deberías ver la página principal del visor

## 🔍 Plan de pruebas completo

### FASE 1: Pruebas básicas de conexión

#### ✅ Prueba 1.1: Verificar página principal
- **Acción**: Abrir http://localhost:3000
- **Resultado esperado**: 
  - Página carga sin errores
  - Se muestra "No hay códigos QR" (primera vez)
  - Botones "Crear QR" y "Gestionar Categorías" visibles

#### ✅ Prueba 1.2: Verificar categorías predefinidas
- **Acción**: Clic en "Gestionar Categorías"
- **Resultado esperado**: 
  - Se muestran 8 categorías predefinidas
  - Cada categoría tiene su color distintivo
  - Botones "Editar" y "Eliminar" funcionan

### FASE 2: Crear y gestionar categorías

#### ✅ Prueba 2.1: Crear nueva categoría
- **Acción**: 
  1. Clic en "Nueva Categoría"
  2. Nombre: "Prueba Test"
  3. Descripción: "Categoría de prueba"
  4. Color: #FF5733
  5. Clic en "Crear"
- **Resultado esperado**: 
  - Categoría se crea exitosamente
  - Aparece en la lista con el color correcto

#### ✅ Prueba 2.2: Editar categoría
- **Acción**: 
  1. Clic en "Editar" en la categoría "Prueba Test"
  2. Cambiar nombre a "Prueba Editada"
  3. Cambiar color a #33FF57
  4. Clic en "Actualizar"
- **Resultado esperado**: 
  - Cambios se guardan correctamente
  - Color se actualiza visualmente

### FASE 3: Crear códigos QR

#### ✅ Prueba 3.1: Crear QR de URL
- **Acción**: 
  1. Ir a página principal → "Crear QR"
  2. Título: "Mi Sitio Web"
  3. Contenido: "https://www.google.com"
  4. Descripción: "Enlace a Google"
  5. Categoría: "URLs"
  6. Clic en "Vista previa" → verificar QR
  7. Clic en "Crear código QR"
- **Resultado esperado**: 
  - QR se genera correctamente
  - Redirecciona a página de detalles
  - Imagen QR se muestra

#### ✅ Prueba 3.2: Crear QR de texto
- **Acción**: 
  1. Crear QR → Título: "Mensaje de prueba"
  2. Contenido: "¡Hola mundo! Este es un mensaje de prueba con caracteres especiales: ñáéíóú"
  3. Categoría: "Texto"
  4. Crear
- **Resultado esperado**: 
  - QR maneja caracteres especiales correctamente
  - Se detecta como tipo "Texto"

#### ✅ Prueba 3.3: Crear QR de contacto
- **Acción**: 
  1. Título: "Mi Contacto"
  2. Contenido: "Juan Pérez\nTeléfono: +57 300 123 4567\nEmail: juan@email.com"
  3. Categoría: "Contacto"
  4. Crear
- **Resultado esperado**: 
  - QR se crea con información de contacto
  - Formato se mantiene correctamente

### FASE 4: Probar funcionalidades de la página principal

#### ✅ Prueba 4.1: Filtros por categoría
- **Acción**: 
  1. Ir a página principal
  2. Probar cada filtro de categoría
  3. Verificar "Todas las categorías"
- **Resultado esperado**: 
  - Filtros muestran solo QRs de la categoría seleccionada
  - Contadores son correctos

#### ✅ Prueba 4.2: Acciones rápidas
- **Acción**: 
  1. Probar botón "Ver detalles"
  2. Probar descarga PNG
  3. Probar descarga PDF
- **Resultado esperado**: 
  - "Ver detalles" abre página correcta
  - Descargas funcionan y archivos se guardan

### FASE 5: Probar página de detalles

#### ✅ Prueba 5.1: Visualización completa
- **Acción**: Abrir cualquier QR creado
- **Resultado esperado**: 
  - QR se muestra en tamaño grande
  - Toda la información es visible
  - Fechas de creación/actualización correctas

#### ✅ Prueba 5.2: Copiar contenido
- **Acción**: Clic en "📋 Copiar contenido"
- **Resultado esperado**: 
  - Contenido se copia al portapapeles
  - Mensaje de confirmación aparece

#### ✅ Prueba 5.3: Exportación en todos los formatos
- **Acción**: 
  1. Descargar como PNG
  2. Descargar como SVG  
  3. Descargar como PDF
- **Resultado esperado**: 
  - Todos los formatos se descargan correctamente
  - PNG: imagen rasterizada
  - SVG: código vectorial
  - PDF: documento con información completa

### FASE 6: Probar eliminación

#### ✅ Prueba 6.1: Eliminar QR
- **Acción**: 
  1. En página de detalles, clic en "🗑️ Eliminar código QR"
  2. Confirmar eliminación
- **Resultado esperado**: 
  - QR se elimina de la base de datos
  - Imagen se elimina del servidor
  - Redirecciona a página principal

#### ✅ Prueba 6.2: Intentar eliminar categoría con QRs
- **Acción**: 
  1. Ir a "Gestionar Categorías"
  2. Intentar eliminar categoría que tiene QRs asociados
- **Resultado esperado**: 
  - Sistema previene eliminación
  - Muestra mensaje de error apropiado

### FASE 7: Pruebas de validación

#### ✅ Prueba 7.1: Contenido muy largo
- **Acción**: 
  1. Crear QR con contenido de más de 2953 caracteres
- **Resultado esperado**: 
  - Sistema muestra error de validación
  - No permite crear el QR

#### ✅ Prueba 7.2: Campos vacíos
- **Acción**: 
  1. Intentar crear QR sin título
  2. Intentar crear QR sin contenido
- **Resultado esperado**: 
  - Validaciones previenen creación
  - Mensajes de error claros

#### ✅ Prueba 7.3: Categoría duplicada
- **Acción**: 
  1. Intentar crear categoría con nombre existente
- **Resultado esperado**: 
  - Sistema previene duplicados
  - Mensaje de error apropiado

### FASE 8: Pruebas de rendimiento

#### ✅ Prueba 8.1: Crear múltiples QRs
- **Acción**: 
  1. Crear 10-15 códigos QR diferentes
  2. Verificar que la página principal carga rápido
- **Resultado esperado**: 
  - Página se mantiene responsiva
  - Imágenes cargan correctamente

#### ✅ Prueba 8.2: Exportación masiva
- **Acción**: 
  1. Descargar varios QRs en diferentes formatos
- **Resultado esperado**: 
  - Descargas no interfieren entre sí
  - Archivos se generan correctamente

## 📱 Pruebas en dispositivos móviles

#### ✅ Prueba 9.1: Responsividad
- **Acción**: 
  1. Abrir en móvil o usar DevTools
  2. Probar todas las funcionalidades
- **Resultado esperado**: 
  - Interfaz se adapta correctamente
  - Botones son fáciles de tocar
  - Formularios son usables

## 🔧 Pruebas técnicas

#### ✅ Prueba 10.1: Verificar base de datos
- **Acción**: 
  1. Ir a phpMyAdmin
  2. Revisar tablas `qr_codes` y `categorias`
  3. Verificar que los datos se guardan correctamente
- **Resultado esperado**: 
  - Datos coinciden con la interfaz
  - Relaciones funcionan correctamente

#### ✅ Prueba 10.2: Verificar archivos de imagen
- **Acción**: 
  1. Ir a carpeta `public/qr-images/`
  2. Verificar que se crean archivos PNG
- **Resultado esperado**: 
  - Archivos se crean con nombres únicos
  - Imágenes son válidas y visualizables

## 📊 Lista de verificación final

- [ ] XAMPP configurado y funcionando
- [ ] Base de datos creada con datos iniciales
- [ ] Proyecto ejecutándose en localhost:3000
- [ ] Categorías: crear, editar, eliminar
- [ ] QRs: crear con diferentes tipos de contenido
- [ ] Filtros por categoría funcionando
- [ ] Exportación en PNG, SVG, PDF
- [ ] Validaciones de formularios
- [ ] Eliminación de QRs y categorías
- [ ] Responsividad en móviles
- [ ] Datos persistiendo en base de datos
- [ ] Archivos de imagen generándose

## 🐛 Qué hacer si algo falla

### Error de conexión a base de datos:
1. Verificar que MySQL esté corriendo en XAMPP
2. Revisar credenciales en `lib/database.ts`
3. Verificar que la base de datos `visor_qr` existe

### Error al crear QR:
1. Verificar que la carpeta `public/qr-images/` existe
2. Revisar permisos de escritura
3. Verificar que las dependencias estén instaladas

### Error en exportación:
1. Verificar que jsPDF y canvas estén instalados
2. Probar con contenido más simple
3. Revisar consola del navegador para errores

## 🎯 Casos de uso reales para probar

1. **QR para WiFi**: `WIFI:T:WPA;S:MiRed;P:mipassword;;`
2. **QR para email**: `mailto:test@email.com?subject=Hola&body=Mensaje`
3. **QR para teléfono**: `tel:+573001234567`
4. **QR para SMS**: `sms:+573001234567?body=Hola`
5. **QR para ubicación**: `geo:4.6097,-74.0817`
6. **QR para evento**: Información de calendario
7. **QR para vCard**: Información de contacto completa

¡Con esta guía podrás probar completamente todas las funcionalidades del visor de códigos QR!