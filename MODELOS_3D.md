# Funcionalidad de Modelos 3D

Este documento describe la nueva funcionalidad de visualización de modelos 3D integrada con el sistema de códigos QR.

## Características Principales

### 1. Visor de Modelos 3D
- **Renderizado WebGL**: Utiliza Three.js y React Three Fiber
- **Controles interactivos**: Rotación, zoom y paneo con mouse/touch
- **Carga optimizada**: Sistema de loading con indicador de progreso
- **Responsive**: Funciona en dispositivos móviles y desktop

### 2. Modelos Disponibles

#### Modelos Simples (Generados por Código)
- **Robot**: Modelo animado de un robot con rotación automática
- **Caja**: Caja simple con rotación continua
- **Casa**: Casa moderna con techo, puerta y ventanas
- **Coche**: Automóvil con ruedas y faros iluminados

#### Soporte para Archivos GLB/GLTF
- Carga de modelos externos desde archivos
- Formatos soportados: GLB (recomendado), GLTF
- Ubicación: `public/models/`

### 3. Integración con Códigos QR

#### Generación Automática
1. Accede a `/modelos`
2. Selecciona un modelo 3D
3. Haz clic en "Generar Código QR"
4. El sistema crea automáticamente un QR con la URL del modelo

#### URLs de Modelos
- Formato: `https://tu-dominio.com/modelo/[id]`
- Ejemplos:
  - `https://tu-dominio.com/modelo/robot`
  - `https://tu-dominio.com/modelo/caja`
  - `https://tu-dominio.com/modelo/casa`
  - `https://tu-dominio.com/modelo/coche`

## Estructura de Archivos

```
visor-3d-qr/
├── app/
│   ├── modelo/[id]/
│   │   └── page.tsx          # Visor individual de modelos
│   └── modelos/
│       └── page.tsx          # Gestión de modelos 3D
├── components/
│   ├── ModelViewer.tsx       # Componente principal del visor
│   └── SimpleModels.tsx      # Modelos generados por código
└── public/
    └── models/
        ├── README.md         # Instrucciones para agregar modelos
        └── [archivos .glb]   # Modelos 3D externos
```

## Uso del Sistema

### Para Usuarios Finales

1. **Escanear QR**: Usa cualquier app de QR para escanear el código
2. **Visualizar**: El modelo se carga automáticamente en el navegador
3. **Interactuar**: 
   - Arrastra para rotar el modelo
   - Usa scroll/pinch para hacer zoom
   - Clic derecho para mover la cámara

### Para Administradores

1. **Gestionar Modelos**: Accede a `/modelos`
2. **Generar QRs**: Crea códigos QR para cada modelo
3. **Agregar Modelos**: Sube archivos GLB a `public/models/`
4. **Configurar**: Actualiza la lista de modelos en el código

## Agregar Nuevos Modelos

### Modelos Simples (Código)
1. Edita `components/SimpleModels.tsx`
2. Crea un nuevo componente de modelo
3. Agrega el caso en `ModelViewer.tsx`
4. Actualiza la lista en `app/modelos/page.tsx`

### Modelos Externos (GLB)
1. Coloca el archivo `.glb` en `public/models/`
2. Actualiza el mapeo en `app/modelo/[id]/page.tsx`
3. Agrega la entrada en `app/modelos/page.tsx`
4. Configura `useSimpleModel={false}` en ModelViewer

## Configuración Técnica

### Dependencias
```json
{
  "@react-three/drei": "^10.6.1",
  "@react-three/fiber": "^9.3.0",
  "three": "^0.178.0"
}
```

### Configuración del Modelo
```typescript
interface ModelData {
  id: string;
  name: string;
  description?: string;
  modelPath: string;
  category?: string;
}
```

### Props del ModelViewer
```typescript
type ModelViewerProps = {
  modelPath: string;
  title?: string;
  description?: string;
  useSimpleModel?: boolean;
};
```

## Optimización y Rendimiento

### Recomendaciones
- **Tamaño de archivo**: Máximo 10MB por modelo
- **Optimización**: Usa herramientas como Blender para reducir polígonos
- **Texturas**: Incluye texturas en el archivo GLB
- **Compresión**: Utiliza compresión Draco cuando sea posible

### Herramientas Útiles
- [Blender](https://www.blender.org/) - Creación y optimización
- [glTF Validator](https://github.khronos.org/glTF-Validator/) - Validación
- [Three.js Editor](https://threejs.org/editor/) - Previsualización

## Solución de Problemas

### Modelo no se carga
1. Verifica que el archivo existe en `public/models/`
2. Confirma que el formato es GLB o GLTF válido
3. Revisa la consola del navegador para errores

### Rendimiento lento
1. Reduce el número de polígonos del modelo
2. Optimiza las texturas (tamaño y formato)
3. Usa compresión Draco si es compatible

### Error en dispositivos móviles
1. Verifica compatibilidad WebGL del dispositivo
2. Reduce la complejidad del modelo
3. Ajusta la configuración de iluminación

## Ejemplos de Uso

### Educación
- Modelos anatómicos interactivos
- Estructuras moleculares
- Objetos históricos

### Comercio
- Productos en 3D para e-commerce
- Catálogos interactivos
- Demostraciones de productos

### Arte y Entretenimiento
- Esculturas digitales
- Personajes de videojuegos
- Instalaciones artísticas

## Próximas Mejoras

- [ ] Soporte para animaciones GLB
- [ ] Realidad aumentada (AR)
- [ ] Editor de materiales en línea
- [ ] Galería de modelos públicos
- [ ] Métricas de visualización
- [ ] Comentarios y valoraciones