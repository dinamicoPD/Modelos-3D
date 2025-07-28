# 🚀 Inicio Rápido - Visor de Códigos QR

## ⚡ Pasos mínimos para empezar a probar

### 1. Verificar XAMPP (2 minutos)
```bash
# Abrir XAMPP Control Panel
# Clic en "Start" para Apache y MySQL
# Verificar que ambos estén en verde
```

### 2. Configurar base de datos (3 minutos)
```bash
# Ir a: http://localhost/phpmyadmin
# Clic en "SQL" (pestaña superior)
# Copiar TODO el contenido de: database/setup.sql
# Pegar en el campo de texto
# Clic en "Continuar"
```

### 3. Iniciar proyecto (1 minuto)
```bash
cd visor-3d-qr
npm run dev
```

### 4. Abrir aplicación
```bash
# Ir a: http://localhost:3000
```

## 🧪 Primera prueba (5 minutos)

### Crear tu primer código QR:
1. **Clic en "Crear QR"**
2. **Llenar formulario:**
   - Título: `Mi primer QR`
   - Contenido: `https://www.google.com`
   - Categoría: `URLs`
3. **Clic en "Vista previa"** → Ver el QR generado
4. **Clic en "Crear código QR"**
5. **¡Listo!** Ya tienes tu primer QR funcionando

### Probar exportación:
1. **En la página de detalles, clic en:**
   - `PNG` → Se descarga imagen
   - `PDF` → Se descarga documento completo
2. **¡Funciona!** 🎉

## 📱 Probar con el móvil

1. **Escanear el QR** con la cámara de tu teléfono
2. **Debería abrir** la URL que pusiste
3. **¡Tu visor de QR está funcionando perfectamente!**

## 🔧 Si algo no funciona

### Error de conexión:
- Verificar que XAMPP esté corriendo
- Reiniciar Apache y MySQL

### Error de base de datos:
- Ejecutar nuevamente el script SQL completo
- Verificar que se creó la base de datos `visor_qr`

### Error del proyecto:
```bash
# Reinstalar dependencias
npm install
npm run dev
```

## 📋 Lista de verificación rápida

- [ ] XAMPP corriendo (Apache + MySQL en verde)
- [ ] Base de datos creada (ejecutar setup.sql)
- [ ] Proyecto corriendo (npm run dev)
- [ ] Página abre en localhost:3000
- [ ] Primer QR creado exitosamente
- [ ] Exportación funciona (PNG/PDF)
- [ ] QR escaneado con móvil funciona

## 🎯 ¡Ya puedes usar tu visor de códigos QR!

Para pruebas más detalladas, consulta [`GUIA_PRUEBAS.md`](GUIA_PRUEBAS.md)