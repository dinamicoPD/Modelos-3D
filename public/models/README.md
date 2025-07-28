# Modelos 3D

Este directorio contiene los modelos 3D que se pueden visualizar a través de códigos QR.

## Formatos Soportados

- **GLB** (recomendado): Formato binario de glTF, más eficiente
- **GLTF**: Formato JSON de glTF con archivos separados

## Modelos Disponibles

Para que funcione el visor, coloca los siguientes archivos en este directorio:

### Modelos de Ejemplo
- `robot.glb` - Modelo de robot animado
- `box.glb` - Caja simple texturizada  
- `house.glb` - Casa moderna
- `car.glb` - Automóvil deportivo

## Cómo Agregar Nuevos Modelos

1. **Coloca el archivo GLB/GLTF** en este directorio
2. **Actualiza el mapeo** en `app/modelo/[id]/page.tsx`
3. **Agrega la entrada** en el objeto `modelos` con:
   - `id`: identificador único
   - `name`: nombre descriptivo
   - `description`: descripción del modelo
   - `modelPath`: ruta al archivo (ej: `/models/mi-modelo.glb`)
   - `category`: categoría del modelo

## Ejemplo de Configuración

```typescript
'mi-modelo': {
  id: 'mi-modelo',
  name: 'Mi Modelo 3D',
  description: 'Descripción del modelo',
  modelPath: '/models/mi-modelo.glb',
  category: 'Mi Categoría'
}
```

## URLs de Acceso

Los modelos se pueden acceder mediante:
- URL directa: `https://tu-dominio.com/modelo/[id]`
- Código QR generado con esa URL

## Recomendaciones

- **Tamaño**: Mantén los archivos bajo 10MB para mejor rendimiento
- **Optimización**: Usa herramientas como Blender o glTF-Pipeline para optimizar
- **Texturas**: Incluye texturas en el archivo GLB para evitar dependencias externas
- **Nombres**: Usa nombres de archivo sin espacios ni caracteres especiales

## Herramientas Útiles

- [Blender](https://www.blender.org/) - Creación y exportación de modelos
- [glTF Validator](https://github.khronos.org/glTF-Validator/) - Validar archivos glTF
- [Three.js Editor](https://threejs.org/editor/) - Previsualizar modelos