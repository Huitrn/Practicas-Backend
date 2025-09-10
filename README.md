# Ejemplos de uso de endpoints
n# Práctica 2: API REST CRUD + PostgreSQL

---

## Paso 1: Diagrama ER

Cliente (1) ────< (N) Pedido

┌─────────────┐         ┌─────────────┐
│  Cliente    │         │   Pedido    │
│─────────────│         │─────────────│
│ id (PK)     │◄─────┐  │ id (PK)     │
│ nombre      │      │  │ clienteId   │
│ email       │      └──│ fecha       │
│ creadoEn    │         │ estado      │
└─────────────┘         │ total       │
                        │ creadoEn    │
                        └─────────────┘

---

## Paso 2: Instalación y configuración

1. Instala Node.js desde [nodejs.org](https://nodejs.org/).
2. Instala dependencias del proyecto:
   ```
   npm install
   ```
3. Instala PostgreSQL y crea la base de datos y tablas usando los scripts de migración.
4. Crea el archivo `.env` usando el ejemplo `.env.example`.
5. Ejecuta el servidor:
   ```
   npx nodemon src/index.js
   ```
   o
   ```
   node src/index.js
   ```
6. Ejecuta el script de seeds para datos de ejemplo:
   ```
   node scripts/seed.js
   ```

---

## Paso 3: Migraciones y Seeds

### Script de migración (creación de tablas)
```sql
-- Tabla Cliente
CREATE TABLE "Cliente" (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  creadoEn TIMESTAMP DEFAULT NOW()
);

-- Tabla Pedido
CREATE TABLE "Pedido" (
  id SERIAL PRIMARY KEY,
  clienteId INTEGER REFERENCES "Cliente"(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  estado VARCHAR(50) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  creadoEn TIMESTAMP DEFAULT NOW()
);

-- Tabla Producto
CREATE TABLE "Producto" (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2) NOT NULL,
  creadoEn TIMESTAMP DEFAULT NOW()
);
```

### Script de seeds (datos de ejemplo)
```sql
INSERT INTO "Cliente" (nombre, email) VALUES ('Juan Pérez', 'juan@example.com');
INSERT INTO "Cliente" (nombre, email) VALUES ('Ana López', 'ana@example.com');

INSERT INTO "Pedido" (clienteId, fecha, estado, total) VALUES (1, '2025-09-09', 'pendiente', 150.00);
INSERT INTO "Pedido" (clienteId, fecha, estado, total) VALUES (2, '2025-09-08', 'completado', 200.00);

INSERT INTO "Producto" (nombre, descripcion, precio) VALUES ('Ejemplo', 'Producto de prueba', 10.99);
```

---

## Paso 4: Consultas avanzadas y tiempos

### Filtros, orden y paginación en GET /pedidos
```
GET /pedidos?clienteId=1&estado=pendiente&sort=fecha,desc&page=1&limit=5
```
Esto retorna los pedidos del cliente 1, con estado 'pendiente', ordenados por fecha descendente, página 1 y máximo 5 resultados.

### Consulta SQL equivalente
```sql
SELECT * FROM "Pedido"
WHERE clienteId = 1 AND estado = 'pendiente'
ORDER BY fecha DESC
OFFSET 0 LIMIT 5;
```

### Medición de tiempos con EXPLAIN ANALYZE
```sql
EXPLAIN ANALYZE SELECT * FROM "Pedido" WHERE clienteId = 1 AND estado = 'pendiente' ORDER BY fecha DESC OFFSET 0 LIMIT 5;
```
Esto mostrará el plan de ejecución y el tiempo estimado de la consulta en PostgreSQL.

---

## Paso 5: Validación de endpoints

### Productos
**GET /productos**
```
GET http://localhost:4000/productos
```
**POST /productos**
```
POST http://localhost:4000/productos
Body (JSON):
{
  "nombre": "Producto de prueba",
  "descripcion": "Descripción de prueba",
  "precio": 99.99
}
```
**GET /productos/1**
```
GET http://localhost:4000/productos/1
```
**PUT /productos/1**
```
PUT http://localhost:4000/productos/1
Body (JSON):
{
  "nombre": "Producto actualizado",
  "descripcion": "Nueva descripción",
  "precio": 120.00
}
```
**DELETE /productos/1**
```
DELETE http://localhost:4000/productos/1
```

### Clientes
**GET /clientes**
```
GET http://localhost:4000/clientes
```
**POST /clientes**
```
POST http://localhost:4000/clientes
Body (JSON):
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com"
}
```
**GET /clientes/1**
```
GET http://localhost:4000/clientes/1
```
**PUT /clientes/1**
```
PUT http://localhost:4000/clientes/1
Body (JSON):
{
  "nombre": "Juan Actualizado",
  "email": "juan.actualizado@example.com"
}
```
**DELETE /clientes/1**
```
DELETE http://localhost:4000/clientes/1
```

### Pedidos
**GET /pedidos?clienteId=1&estado=pendiente&sort=fecha,desc&page=1&limit=5**
```
GET http://localhost:4000/pedidos?clienteId=1&estado=pendiente&sort=fecha,desc&page=1&limit=5
```
**POST /pedidos**
```
POST http://localhost:4000/pedidos
Body (JSON):
{
  "clienteId": 1,
  "fecha": "2025-09-09",
  "estado": "pendiente",
  "total": 150.00
}
```
**GET /pedidos/1**
```
GET http://localhost:4000/pedidos/1
```
**PUT /pedidos/1**
```
PUT http://localhost:4000/pedidos/1
Body (JSON):
{
  "clienteId": 1,
  "fecha": "2025-09-10",
  "estado": "completado",
  "total": 200.00
}
```
**DELETE /pedidos/1**
```
DELETE http://localhost:4000/pedidos/1
```
  "estado": "pendiente",
  "total": 150.00
}
```

**GET /pedidos/1**
```
GET http://localhost:4000/pedidos/1
```

**PUT /pedidos/1**
```
PUT http://localhost:4000/pedidos/1
Body (JSON):
{
  "clienteId": 1,
  "fecha": "2025-09-10",
  "estado": "completado",
  "total": 200.00
}
```

**DELETE /pedidos/1**
```
DELETE http://localhost:4000/pedidos/1
```
# Ejemplos de consultas avanzadas y tiempos

## Filtros, orden y paginación en GET /pedidos

Ejemplo de consulta:

```
GET /pedidos?clienteId=1&estado=pendiente&sort=fecha,desc&page=1&limit=5
```

Esto retorna los pedidos del cliente 1, con estado 'pendiente', ordenados por fecha descendente, página 1 y máximo 5 resultados.

## Consulta SQL equivalente

```sql
SELECT * FROM "Pedido"
WHERE clienteId = 1 AND estado = 'pendiente'
ORDER BY fecha DESC
OFFSET 0 LIMIT 5;
```

## Medición de tiempos con EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE SELECT * FROM "Pedido" WHERE clienteId = 1 AND estado = 'pendiente' ORDER BY fecha DESC OFFSET 0 LIMIT 5;
```

Esto mostrará el plan de ejecución y el tiempo estimado de la consulta en PostgreSQL.
# Migraciones y Seeds

## Script de migración (creación de tablas)

```sql
-- Tabla Cliente
CREATE TABLE "Cliente" (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  creadoEn TIMESTAMP DEFAULT NOW()
);

-- Tabla Pedido
CREATE TABLE "Pedido" (
  id SERIAL PRIMARY KEY,
  clienteId INTEGER REFERENCES "Cliente"(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  estado VARCHAR(50) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  creadoEn TIMESTAMP DEFAULT NOW()
);

-- Tabla Producto
CREATE TABLE "Producto" (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2) NOT NULL,
  creadoEn TIMESTAMP DEFAULT NOW()
);
```

## Script de seeds (datos de ejemplo)

```sql
INSERT INTO "Cliente" (nombre, email) VALUES ('Juan Pérez', 'juan@example.com');
INSERT INTO "Cliente" (nombre, email) VALUES ('Ana López', 'ana@example.com');

INSERT INTO "Pedido" (clienteId, fecha, estado, total) VALUES (1, '2025-09-09', 'pendiente', 150.00);
INSERT INTO "Pedido" (clienteId, fecha, estado, total) VALUES (2, '2025-09-08', 'completado', 200.00);

INSERT INTO "Producto" (nombre, descripcion, precio) VALUES ('Ejemplo', 'Producto de prueba', 10.99);
```

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
Desarrollado con Node.js, Express y Zod.
# Diagrama ER

Cliente (1) ────< (N) Pedido

┌─────────────┐         ┌─────────────┐
│  Cliente    │         │   Pedido    │
│─────────────│         │─────────────│
│ id (PK)     │◄─────┐  │ id (PK)     │
│ nombre      │      │  │ clienteId   │
│ email       │      └──│ fecha       │
│ creadoEn    │         │ estado      │
└─────────────┘         │ total       │
                        │ creadoEn    │
                        └─────────────┘
