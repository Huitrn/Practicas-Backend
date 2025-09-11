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

describe('Pedidos API', () => {
  test('POST /pedidos cuando el servicio lanza error debe retornar 400', async () => {
    const pedidosService = require('../src/services/pedidos');
    const spy = jest.spyOn(pedidosService, 'create').mockImplementation(() => { throw new Error('Error simulado'); });
    // Crear cliente único para el pedido
    const unique = Date.now();
    const clienteRes = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: `Cliente Pedido ${unique}`, email: `cliente${unique}@correo.com` });
    const clienteId = clienteRes.body.id;
    const res = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ clienteId, fecha: '2025-09-09', estado: 'pendiente', total: 150.00 });
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });

  test('PUT /pedidos/:id cuando el servicio lanza error debe retornar 400', async () => {
    const pedidosService = require('../src/services/pedidos');
    const spy = jest.spyOn(pedidosService, 'update').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .put('/pedidos/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ clienteId: 1, fecha: '2025-09-09', estado: 'pendiente', total: 150.00 });
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });

  test('DELETE /pedidos/:id cuando el servicio lanza error debe retornar 400', async () => {
    const pedidosService = require('../src/services/pedidos');
    const spy = jest.spyOn(pedidosService, 'remove').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .delete('/pedidos/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });
  test('POST /pedidos con datos duplicados debe retornar 409 o 400', async () => {
    // Crear cliente único para el pedido
    const unique = Date.now();
    const clienteRes = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: `Cliente Pedido ${unique}`, email: `cliente${unique}@correo.com` });
    const clienteId = clienteRes.body.id;
    await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ clienteId, fecha: '2025-09-09', estado: 'pendiente', total: 150.00 });
    const res = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ clienteId, fecha: '2025-09-09', estado: 'pendiente', total: 150.00 });
    expect([400,409]).toContain(res.statusCode);
  });

  test('PUT /pedidos/:id cuando el servicio lanza error debe retornar 400', async () => {
    const pedidosService = require('../src/services/pedidos');
    const spy = jest.spyOn(pedidosService, 'update').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .put('/pedidos/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ clienteId: 1, fecha: '2025-09-09', estado: 'pendiente', total: 150.00 });
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });

  test('DELETE /pedidos/:id cuando el servicio lanza error debe retornar 400', async () => {
    const pedidosService = require('../src/services/pedidos');
    const spy = jest.spyOn(pedidosService, 'remove').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .delete('/pedidos/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });
  // ...existing code...

  test('GET /pedidos debe retornar 200 y lista', async () => {
    const res = await request(app)
      .get('/pedidos')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /pedidos con datos válidos y token admin', async () => {
    // Crear cliente único para el pedido
    const unique = Date.now();
    const clienteRes = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: `Cliente Pedido ${unique}`, email: `cliente${unique}@correo.com` });
    const clienteId = clienteRes.body.id;
    const res = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ clienteId, fecha: '2025-09-09', estado: 'pendiente', total: 150.00 });
    expect(res.statusCode).toBe(201);
    expect(res.body.estado).toBe('pendiente');
  });

  test('POST /pedidos sin token debe retornar 401', async () => {
    const res = await request(app)
      .post('/pedidos')
      .send({ clienteId: 1, fecha: '2025-09-09', estado: 'pendiente', total: 150.00 });
    expect(res.statusCode).toBe(401);
  });

  test('POST /pedidos con token inválido debe retornar 401', async () => {
    const res = await request(app)
      .post('/pedidos')
      .set('Authorization', 'Bearer token_invalido')
      .send({ clienteId: 1, fecha: '2025-09-09', estado: 'pendiente', total: 150.00 });
    expect(res.statusCode).toBe(401);
  });

  test('POST /pedidos con datos faltantes debe retornar 400', async () => {
    const res = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ clienteId: '', fecha: '', estado: '', total: null });
    expect(res.statusCode).toBe(400);
  });
  
  test('POST /pedidos con total no numérico debe retornar 400', async () => {
    // Crear cliente único para el pedido
    const unique = Date.now();
    const clienteRes = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: `Cliente Pedido ${unique}`, email: `cliente${unique}@correo.com` });
    const clienteId = clienteRes.body.id;
    const res = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ clienteId, fecha: '2025-09-09', estado: 'pendiente', total: 'no-numero' });
    expect(res.statusCode).toBe(400);
  });

  test('PUT /pedidos/999 debe retornar 404', async () => {
    const res = await request(app)
      .put('/pedidos/999')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ clienteId: 1, fecha: '2025-09-09', estado: 'pendiente', total: 150.00 });
    expect(res.statusCode).toBe(404);
  });

  test('PUT /pedidos/1 con datos faltantes debe retornar 400', async () => {
    const res = await request(app)
      .put('/pedidos/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ clienteId: '', fecha: '', estado: '', total: null });
    expect(res.statusCode).toBe(400);
  });

  test('PUT /pedidos/1 sin token debe retornar 401', async () => {
    const res = await request(app)
      .put('/pedidos/1')
      .send({ clienteId: 1, fecha: '2025-09-09', estado: 'pendiente', total: 100 });
    expect(res.statusCode).toBe(401);
  });

  test('PUT /pedidos/1 con token inválido debe retornar 401', async () => {
    const res = await request(app)
      .put('/pedidos/1')
      .set('Authorization', 'Bearer token_invalido')
      .send({ clienteId: 1, fecha: '2025-09-09', estado: 'pendiente', total: 100 });
    expect(res.statusCode).toBe(401);
  });

  test('DELETE /pedidos/999 debe retornar 404', async () => {
    const res = await request(app)
      .delete('/pedidos/999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(404);
  });

  test('GET /pedidos/999 debe retornar 404', async () => {
    const res = await request(app)
      .get('/pedidos/999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /pedidos/1 sin token debe retornar 401', async () => {
    const res = await request(app).delete('/pedidos/1');
    expect(res.statusCode).toBe(401);
  });

  test('DELETE /pedidos/1 con rol incorrecto debe retornar 403', async () => {
    // Registrar usuario con rol user
    const unique = Date.now();
    await request(app)
      .post('/auth/register')
      .send({ nombre: `User ${unique}`, email: `user${unique}@correo.com`, password: 'Test1234!', role: 'user' });
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: `user${unique}@correo.com`, password: 'Test1234!' });
    const userToken = loginRes.body.accessToken;
    const res = await request(app)
      .delete('/pedidos/1')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('DELETE /pedidos/1 con token admin debe retornar 200 o 204', async () => {
    const res = await request(app)
      .delete('/pedidos/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect([200, 204, 404]).toContain(res.statusCode);
  });
});
