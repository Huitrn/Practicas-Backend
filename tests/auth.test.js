const request = require('supertest');
const app = require('../src/index');
const clientesService = require('../src/services/clientes');

let accessToken;

beforeAll(async () => {
  // Registrar el usuario admin (por si no existe)
  await request(app)
    .post('/auth/register')
    .send({ nombre: 'Admin', email: 'admin@correo.com', password: '123456', role: 'admin' });
  // Login para obtener el token
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'admin@correo.com', password: '123456' });
  accessToken = res.body.accessToken;
});

describe('Auth API', () => {
  test('GET /clientes con cabecera Authorization mal formada debe retornar 401', async () => {
    const res = await request(app)
      .get('/clientes')
      .set('Authorization', 'Bearer') // Sin token
    expect(res.statusCode).toBe(401);
  });

  test('GET /clientes con token expirado debe retornar 401', async () => {
    const jwt = require('jsonwebtoken');
    const expiredToken = jwt.sign({ sub: 1, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: -1 });
    const res = await request(app)
      .get('/clientes')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.statusCode).toBe(401);
  });

  test('POST /auth/refresh sin token debe retornar 401', async () => {
    const res = await request(app)
      .post('/auth/refresh')
      .send({});
    expect(res.statusCode).toBe(401);
  });

  test('POST /auth/refresh con token inválido debe retornar 401', async () => {
    const res = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: 'token_invalido' });
    expect(res.statusCode).toBe(401);
  });
  test('POST /auth/login con usuario inexistente debe retornar 401', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'noexiste@correo.com', password: '123456' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /auth/register cuando el servicio lanza error debe retornar 400', async () => {
    const clientesService = require('../src/services/clientes');
    const spy = jest.spyOn(clientesService, 'create').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .post('/auth/register')
      .send({ nombre: 'Error', email: 'error@correo.com', password: '123456', role: 'user' });
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });

  test('POST /auth/login cuando el servicio lanza error debe retornar 400', async () => {
    const userModel = require('../src/auth/userModel');
    const spy = jest.spyOn(userModel, 'findByEmail').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@correo.com', password: '123456' });
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });
  test('POST /auth/login debe retornar 200 y tokens', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@correo.com', password: '123456' });
    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  test('POST /auth/login con credenciales incorrectas debe retornar 401', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@correo.com', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /auth/login sin datos debe retornar 400', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({});
    expect(res.statusCode).toBe(400);
  });
  
  test('POST /auth/login con email malformado debe retornar 401 o 400', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'correo-invalido', password: 'Test1234!' });
    expect([400,401]).toContain(res.statusCode);
  });

  test('GET /clientes sin cabecera Authorization debe retornar 401', async () => {
    const res = await request(app)
      .get('/clientes');
    expect(res.statusCode).toBe(401);
  });

  test('GET /productos sin cabecera Authorization debe retornar 401', async () => {
    const res = await request(app)
      .get('/productos');
    expect(res.statusCode).toBe(401);
  });

  test('GET /pedidos sin cabecera Authorization debe retornar 401', async () => {
    const res = await request(app)
      .get('/pedidos');
    expect(res.statusCode).toBe(401);
  });

  test('POST /auth/register con email duplicado debe retornar 409', async () => {
    const unique = Date.now();
    const email = `dup${unique}@correo.com`;
    await request(app)
      .post('/auth/register')
      .send({ nombre: `Test ${unique}`, email, password: 'Test1234!', role: 'user' });
    const res = await request(app)
      .post('/auth/register')
      .send({ nombre: `Test ${unique}`, email, password: 'Test1234!', role: 'user' });
    expect(res.statusCode).toBe(409);
  });

  test('POST /auth/register con contraseña débil debe retornar 400', async () => {
    const unique = Date.now();
    const res = await request(app)
      .post('/auth/register')
      .send({ nombre: `Test ${unique}`, email: `weak${unique}@correo.com`, password: '123456', role: 'user' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /auth/refresh con token revocado debe retornar 401', async () => {
    // Simula registro y login para obtener refreshToken
    const unique = Date.now();
    const regRes = await request(app)
      .post('/auth/register')
      .send({ nombre: `Test ${unique}`, email: `ref${unique}@correo.com`, password: 'Test1234!', role: 'user' });
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: `ref${unique}@correo.com`, password: 'Test1234!' });
    const refreshToken = loginRes.body.refreshToken;
    // Revoca el token
    await request(app)
      .post('/auth/revoke')
      .send({ refreshToken });
    // Intenta refrescar con el token revocado
    const res = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken });
    expect(res.statusCode).toBe(401);
  });

  test('POST /auth/register con datos válidos debe retornar 201', async () => {
    const unique = Date.now();
    const res = await request(app)
      .post('/auth/register')
      .send({ nombre: `Test ${unique}`, email: `test${unique}@correo.com`, password: 'Test1234!', role: 'user' });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toContain('test');
  });

  test('POST /auth/register con datos faltantes debe retornar 400', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ nombre: '', email: '', password: '' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /auth/refresh con refreshToken inválido debe retornar 401', async () => {
    const res = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: 'token_invalido' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /auth/revoke con refreshToken inválido debe retornar 401', async () => {
    const res = await request(app)
      .post('/auth/revoke')
      .send({ refreshToken: 'token_invalido' });
    expect(res.statusCode).toBe(401);
  });
});
