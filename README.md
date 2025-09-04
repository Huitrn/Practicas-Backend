
# API REST CRUD de Productos

## Instalación y ejecución

### 1. Instalar Node.js
Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/).

### 2. Instalar dependencias del proyecto
Abre una terminal en la carpeta del proyecto y ejecuta:
```
npm install
```

### 3. Instalar Postman
Descarga e instala Postman desde [postman.com/downloads](https://www.postman.com/downloads/).

### 4. Ejecutar el servidor
En la terminal, ejecuta:
```
npx nodemon src/index.js
```
o
```
node src/index.js
```
El servidor estará disponible en `http://localhost:4000`.

## Cómo probar los métodos

### GET (Listar productos)
En Postman, crea una petición GET a:
```
http://localhost:4000/productos
```
Haz clic en "Send" y verás la lista de productos.

### POST (Crear producto)
En Postman, crea una petición POST a:
```
http://localhost:4000/productos
```
En la pestaña "Body", selecciona "raw" y "JSON". Escribe:
```
{
  "nombre": "Lapiz",
  "precio": 10,
  "stock": 100
}
```
Haz clic en "Send" y verás el producto creado.

### PUT (Actualizar producto)
En Postman, crea una petición PUT a:
```
http://localhost:4000/productos/1
```
En "Body" (raw, JSON):
```
{
  "nombre": "Lapiz HB",
  "precio": 12,
  "stock": 90
}
```
Haz clic en "Send" y verás el producto actualizado.

### DELETE (Eliminar producto)
En Postman, crea una petición DELETE a:
```
http://localhost:4000/productos/1
```
Haz clic en "Send" y verás el mensaje de confirmación.

---

## Endpoints principales

### 1. Listar productos (GET)
```
GET http://localhost:4000/productos
```
**Respuesta:**
```json
{
  "total": 1,
  "page": 1,
  "limit": 10,
  "productos": [
    {
      "id": 1,
      "nombre": "Lapiz",
      "precio": 10,
      "stock": 100,
      "creadoEn": "2025-09-03T00:00:00.000Z"
    }
  ]
}
```

### 2. Crear producto (POST)
```
POST http://localhost:4000/productos
Content-Type: application/json
```
**Body:**
```json
{
  "nombre": "Lapiz",
  "precio": 10,
  "stock": 100
}
```
**Respuesta:**
```json
{
  "id": 1,
  "nombre": "Lapiz",
  "precio": 10,
  "stock": 100,
  "creadoEn": "2025-09-03T00:00:00.000Z"
}
```

### 3. Obtener producto por ID (GET)
```
GET http://localhost:4000/productos/1
```
**Respuesta:**
```json
{
  "id": 1,
  "nombre": "Lapiz",
  "precio": 10,
  "stock": 100,
  "creadoEn": "2025-09-03T00:00:00.000Z"
}
```

### 4. Actualizar producto (PUT)
```
PUT http://localhost:4000/productos/1
Content-Type: application/json
```
**Body:**
```json
{
  "nombre": "Lapiz HB",
  "precio": 12,
  "stock": 90
}
```
**Respuesta:**
```json
{
  "id": 1,
  "nombre": "Lapiz HB",
  "precio": 12,
  "stock": 90,
  "creadoEn": "2025-09-03T00:00:00.000Z"
}
```

### 5. Eliminar producto (DELETE)
```
DELETE http://localhost:4000/productos/1
```
**Respuesta:**
```json
{
  "mensaje": "Producto eliminado"
}
```

## Ejemplo de error de validación
```
POST http://localhost:4000/productos
Content-Type: application/json
```
**Body:**
```json
{
  "nombre": "",
  "precio": -5,
  "stock": -1
}
```
**Respuesta:**
```json
{
  "error": "El nombre es requerido"
}
```

## Colección Postman
Puedes exportar tu colección desde Postman y adjuntarla a la entrega.

---

Desarrollado con Node.js, Express y Zod.
