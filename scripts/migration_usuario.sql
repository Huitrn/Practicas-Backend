-- Tabla Usuario para autenticación y roles
CREATE TABLE "Usuario" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  creadoEn TIMESTAMP DEFAULT NOW()
);
