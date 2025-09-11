# Practicas Backend

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

      "precio": 10,
      "stock": 100,
      "creadoEn": "2025-09-03T00:00:00.000Z"
  ]
}

### 2. Crear producto (POST)
POST http://localhost:4000/productos
Content-Type: application/json
**Body:**
```json
  "nombre": "Lapiz",
  "precio": 10,
}
```
```json
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
---


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

# Práctica 3: Autenticación con JWT y roles

## Paso 1: Instalación y dependencias

Instala los siguientes paquetes:
```
npm install bcrypt jsonwebtoken dotenv
```
Asegúrate de tener en `.env`:
```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/tu_db
JWT_SECRET=tu_clave_secreta
JWT_REFRESH_SECRET=tu_clave_refresh
PORT=4000
```

## Paso 2: Migración y modelo de usuario

Ejecuta el script de migración para la tabla Usuario:
```sql
CREATE TABLE "Usuario" (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'user',
  creadoEn TIMESTAMP DEFAULT NOW()
);
```

## Paso 3: Registro y login (emisión de JWT)

### Registro
```
POST http://localhost:4000/auth/register
Body (JSON):
{
  "nombre": "Admin",
  "email": "admin@correo.com",
  "password": "123456",
  "rol": "admin"
}
```
Respuesta:
```
{
  "id": 1,
  "nombre": "Admin",
  "email": "admin@correo.com",
  "rol": "admin"
}
```

### Login
```
POST http://localhost:4000/auth/login
Body (JSON):
{
  "email": "admin@correo.com",
  "password": "123456"
}
```
Respuesta:
```
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

## Paso 4: Middleware de autenticación y roles

Se implementa middleware para verificar el JWT y el rol del usuario. Ejemplo de uso en rutas:
```js
const { verificarJWT } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/permissions');

router.post('/productos', verificarJWT, requireAdmin, controller.crear);
```

## Paso 5: Protección de rutas

Las rutas de productos, pedidos y clientes requieren autenticación y rol admin para crear, actualizar o eliminar.

## Paso 6: Endpoints de refresh y revocación de tokens

### Refresh
```
POST http://localhost:4000/auth/refresh
Body (JSON):
{
  "refreshToken": "..."
}
```
Respuesta:
```
{
  "accessToken": "..."
}
```

### Revocar refresh token
```
POST http://localhost:4000/auth/revoke
Body (JSON):
{
  "refreshToken": "..."
}
```
Respuesta:
```
{
  "mensaje": "Refresh token revocado"
}
```

## Paso 7: Ejemplos de pruebas en Postman

### 1. Registro de usuario
![](./docs/postman_register.png)

### 2. Login y obtención de tokens
![](./docs/postman_login.png)

### 3. Acceso a rutas protegidas
Agrega el token de acceso en la cabecera:
```
Authorization: Bearer <accessToken>
```
Ejemplo POST a /productos:
![](./docs/postman_productos_post.png)

Body:
```
{
  "nombre": "Lapiz",
  "precio": 10,
  "stock": 100
}
```

### 4. Error de token inválido o expirado
Si el token es incorrecto o expiró:
![](./docs/postman_token_error.png)
Respuesta:
```
{
  "error": "Token inválido o expirado"
}
```

### 5. Refresh y revocación
![](./docs/postman_refresh.png)
![](./docs/postman_revoke.png)

## Paso 8: Notas y recomendaciones

- Usa el accessToken para acceder a rutas protegidas.
- El refreshToken solo sirve para obtener nuevos accessToken.
- Si recibes 401 Unauthorized, genera un nuevo token con login o refresh.
- Los tokens revocados no pueden usarse nuevamente.

---
## Practica 4
## Descripción
API REST CRUD para gestión de productos, clientes y pedidos, con autenticación JWT, roles y pruebas automatizadas.

## Tecnologías
- Node.js
- Express
- PostgreSQL
- JWT
- Jest + Supertest

## Instalación
1. Clona el repositorio:
  ```bash
  git clone https://github.com/Huitrn/Practicas-Backend.git
  cd Practicas-Backend
  ```
2. Instala dependencias:
  ```bash
  npm install
  ```
3. Configura tu archivo `.env`:
  ```env
  DATABASE_URL=postgres://usuario:password@localhost:5432/tu_db
  JWT_SECRET=tu_jwt_secret
  JWT_REFRESH_SECRET=tu_jwt_refresh_secret
  PORT=3000
  ```

## Pruebas automatizadas
- Las pruebas usan una base de datos de test real (PostgreSQL).
- Antes de cada test se recomienda limpiar las tablas relevantes.
- Ejecuta los tests y coverage:
  ```bash
  npm run test:coverage
  ```
- El umbral mínimo de cobertura recomendado es 80%.

## Endpoints cubiertos
- Autenticación: `/auth/register`, `/auth/login`, `/auth/refresh`
- Productos: CRUD completo, validación de duplicados, errores de datos
- Clientes: CRUD completo, roles, errores de datos y duplicados
- Pedidos: CRUD completo, validación de duplicados, errores de datos

## Estrategia de testing
1. **Entorno de test separado:**
  - Usa una base de datos de test y variables de entorno específicas.
2. **Semilla y limpieza de datos:**
  - Limpieza automática antes de cada test.
3. **Cobertura:**
  - Pruebas para escenarios felices y de error (401, 403, 404, 409, datos faltantes, duplicados, etc).
  - Cobertura medida con Jest.
4. **CI/CD:**
  - Workflow de GitHub Actions en `.github/workflows/test.yml` para ejecutar tests y coverage en cada push/PR.

## Ejemplo de archivo `.env.test`
```env
DATABASE_URL=postgres://testuser:testpass@localhost:5432/testdb
JWT_SECRET=testsecret
JWT_REFRESH_SECRET=testrefreshsecret
PORT=3000
```

## Ejemplo de limpieza de BD en tests
Puedes agregar en tus tests:
```js
beforeEach(async () => {
  await pool.query('TRUNCATE "Producto", "Cliente", "Pedido" RESTART IDENTITY CASCADE');
});
```

## Cómo contribuir
- Haz un fork y PR.
- Ejecuta los tests antes de enviar cambios.

## Autor
- Huitrn

---
¿Dudas o mejoras? ¡Contáctame!
#
## Práctica 5

## Descripción
Documentación automática y navegable de la API REST CRUD usando Swagger/OpenAPI. Incluye seguridad JWT, ejemplos claros y validación del spec.

## Tecnologías
- Node.js

- Express
- Swagger UI Express

- swagger-jsdoc
- OpenAPI 3.0

## Instalación y configuración
1. Instala los paquetes necesarios:

  ```bash
  npm install swagger-jsdoc swagger-ui-express

2. Asegúrate de tener el archivo `openapi.yaml` en la raíz del proyecto.
3. Integra Swagger UI en tu servidor Express:
  ```js
  const swaggerUi = require('swagger-ui-express');
  const YAML = require('yamljs');
  const swaggerDocument = YAML.load('./openapi.yaml');
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  ```
4. Inicia el servidor y accede a la documentación en [http://localhost:3000/docs](http://localhost:3000/docs).
## Validación del spec
- El archivo `openapi.yaml` fue validado en Swagger Editor y corregido para evitar errores y advertencias.
- La documentación incluye todos los endpoints, parámetros, respuestas, ejemplos y seguridad JWT.
## Ejemplos de endpoints documentados
- Productos: `/productos`, `/productos/{id}`
- Clientes: `/clientes`, `/clientes/{id}`
- Pedidos: `/pedidos`, `/pedidos/{id}`
- Autenticación: `/auth/login`
- Todos los endpoints protegidos incluyen el esquema JWT Bearer.

## Recomendaciones y buenas prácticas
- Mantén el archivo `openapi.yaml` actualizado con cada cambio en la API.
- Usa ejemplos claros y descripciones detalladas para facilitar el consumo de la API.
- Valida el spec en Swagger Editor antes de cada entrega.
- Incluye una captura de pantalla de la documentación en el README.

## Cómo contribuir
- Haz un fork y PR.
- Actualiza la documentación si agregas o modificas endpoints.

## Autor
- Huitrn

---

---
# Ejemplos de uso de endpoints



![swagger editor](image-1.png)

![Pruebas postman ](image-2.png)
