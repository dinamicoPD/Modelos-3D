# Visor de Códigos QR

Un sistema completo para generar, almacenar y gestionar códigos QR con soporte para visualización de modelos 3D interactivos usando Next.js, Tailwind CSS y MySQL.

## 🚀 Características

- **Generación de códigos QR**: Crea códigos QR personalizados a partir de texto, URLs, contactos, etc.
- **Modelos 3D interactivos**: Visualiza modelos 3D a través de códigos QR con WebGL
- **Almacenamiento en base de datos**: Guarda todos los códigos QR con información detallada
- **Sistema de categorías**: Organiza tus códigos QR por categorías con colores personalizados
- **Exportación múltiple**: Descarga códigos QR en formatos PNG, SVG y PDF
- **Interfaz moderna**: Diseño responsive con Tailwind CSS
- **Gestión completa**: CRUD completo para códigos QR y categorías
- **Visor 3D**: Renderizado de modelos GLB/GLTF con controles interactivos

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilos**: Tailwind CSS 4
- **Base de datos**: MySQL (XAMPP)
- **Generación QR**: qrcode, qrcode.react
- **Exportación**: jsPDF, html2canvas
- **3D Rendering**: Three.js, React Three Fiber, React Three Drei
- **ORM**: mysql2

## 📋 Requisitos previos

- Node.js 18 o superior
- XAMPP con MySQL
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd visor-3d-qr
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar XAMPP
1. Inicia XAMPP
2. Activa Apache y MySQL
3. Abre phpMyAdmin (http://localhost/phpmyadmin)
4. Ejecuta el script SQL ubicado en `database/setup.sql`

### 4. Configurar la base de datos
El archivo `database/setup.sql` contiene:
- Creación de la base de datos `visor_qr`
- Tablas `categorias` y `qr_codes`
- Datos iniciales de categorías
- Índices y relaciones

### 5. Verificar configuración
Asegúrate de que la configuración en `lib/database.ts` coincida con tu instalación de XAMPP:
```typescript
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // XAMPP por defecto
  database: 'visor_qr',
  charset: 'utf8mb4'
};
```

### 6. Ejecutar el proyecto
```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

## 📁 Estructura del proyecto

```
visor-3d-qr/
├── app/
│   ├── api/
│   │   ├── qr/
│   │   │   ├── route.ts              # CRUD de códigos QR
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts          # QR por ID
│   │   │   │   └── export/
│   │   │   │       └── route.ts      # Exportación
│   │   └── categorias/
│   │       └── route.ts              # CRUD de categorías
│   ├── qr/
│   │   ├── crear/
│   │   │   └── page.tsx              # Crear QR
│   │   └── [id]/
│   │       └── page.tsx              # Detalles QR
│   ├── categorias/
│   │   └── page.tsx                  # Gestión categorías
│   ├── page.tsx                      # Página principal
│   └── layout.tsx                    # Layout principal
├── lib/
│   ├── database.ts                   # Conexión y servicios DB
│   └── qr-utils.ts                   # Utilidades QR
├── database/
│   └── setup.sql                     # Script de configuración
├── public/
│   └── qr-images/                    # Imágenes generadas
└── components/                       # Componentes reutilizables
```

## 🗄️ Base de datos

### Tabla `categorias`
- `id`: Clave primaria
- `nombre`: Nombre único de la categoría
- `descripcion`: Descripción opcional
- `color`: Color hexadecimal
- `fecha_creacion`: Timestamp de creación
- `fecha_actualizacion`: Timestamp de actualización

### Tabla `qr_codes`
- `id`: Clave primaria
- `titulo`: Título del código QR
- `descripcion`: Descripción opcional
- `contenido`: Contenido del QR (texto/URL)
- `categoria_id`: Referencia a categoría (opcional)
- `imagen_path`: Ruta de la imagen generada
- `fecha_creacion`: Timestamp de creación
- `fecha_actualizacion`: Timestamp de actualización

## 🔌 API Endpoints

### Códigos QR
- `GET /api/qr` - Listar códigos QR
- `POST /api/qr` - Crear código QR
- `PUT /api/qr` - Actualizar código QR
- `DELETE /api/qr?id={id}` - Eliminar código QR
- `GET /api/qr/{id}` - Obtener código QR por ID
- `GET /api/qr/{id}/export?format={png|svg|pdf}` - Exportar código QR

### Categorías
- `GET /api/categorias` - Listar categorías
- `POST /api/categorias` - Crear categoría
- `PUT /api/categorias` - Actualizar categoría
- `DELETE /api/categorias?id={id}` - Eliminar categoría

## 🎨 Funcionalidades principales

### 1. Página principal
- Lista de todos los códigos QR
- Filtros por categoría
- Vista previa de códigos QR
- Acciones rápidas (ver, descargar, eliminar)

### 2. Crear código QR
- Formulario con validaciones
- Vista previa en tiempo real
- Selección de categoría
- Detección automática del tipo de contenido

### 3. Detalles del código QR
- Información completa del QR
- Opciones de descarga (PNG, SVG, PDF)
- Edición y eliminación
- Copia del contenido al portapapeles

### 4. Gestión de categorías
- CRUD completo de categorías
- Selector de color personalizado
- Validación de eliminación (no permite eliminar si tiene QRs asociados)

### 5. Exportación
- **PNG**: Imagen rasterizada de alta calidad
- **SVG**: Imagen vectorial escalable
- **PDF**: Documento con información completa del QR

## 🔧 Configuración avanzada

### Personalización de códigos QR
Los códigos QR se pueden personalizar modificando `lib/qr-utils.ts`:
- Nivel de corrección de errores
- Tamaño y márgenes
- Colores personalizados

### Almacenamiento de imágenes
Las imágenes se guardan en `public/qr-images/` con nombres únicos basados en timestamp.

### Validaciones
- Contenido máximo: 2953 caracteres
- Formatos de color: Hexadecimal (#RRGGBB)
- Nombres de categoría únicos

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Variables de entorno (opcional)
Crea un archivo `.env.local` para configuraciones específicas:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=visor_qr
```

## 🐛 Solución de problemas

### Error de conexión a MySQL
1. Verifica que XAMPP esté ejecutándose
2. Confirma que MySQL esté activo en el puerto 3306
3. Revisa las credenciales en `lib/database.ts`

### Error al crear directorio de imágenes
El directorio `public/qr-images/` se crea automáticamente, pero asegúrate de que la aplicación tenga permisos de escritura.

### Problemas de TypeScript
Ejecuta `npm run build` para verificar errores de tipos antes del despliegue.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte o preguntas, abre un issue en el repositorio del proyecto.
