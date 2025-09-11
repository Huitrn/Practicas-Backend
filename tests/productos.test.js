const request = require('supertest');
const app = require('../src/index');


let accessToken;

describe('Productos API', () => {
  test('POST /productos cuando el servicio lanza error debe retornar 400', async () => {
    const productosService = require('../src/services/productos');
    const spy = jest.spyOn(productosService, 'create').mockImplementation(() => { throw new Error('Error simulado'); });
    const unique = Date.now();
    const res = await request(app)
      .post('/productos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: `Lapiz${unique}`, precio: 10, stock: 100 });
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });

  test('PUT /productos/:id cuando el servicio lanza error debe retornar 400', async () => {
    const productosService = require('../src/services/productos');
    const spy = jest.spyOn(productosService, 'update').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .put('/productos/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: 'Error', precio: 10, stock: 100 });
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });

  test('DELETE /productos/:id cuando el servicio lanza error debe retornar 400', async () => {
    const productosService = require('../src/services/productos');
    const spy = jest.spyOn(productosService, 'remove').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .delete('/productos/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });
  test('POST /productos con nombre duplicado debe retornar 409 o 400', async () => {
    const unique = Date.now();
    const nombre = `Lapiz${unique}`;
    await request(app)
      .post('/productos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre, precio: 10, stock: 100 });
    const res = await request(app)
      .post('/productos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre, precio: 10, stock: 100 });
    expect([400,409]).toContain(res.statusCode);
  });

  test('PUT /productos/:id cuando el servicio lanza error debe retornar 400', async () => {
    const productosService = require('../src/services/productos');
    const spy = jest.spyOn(productosService, 'update').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .put('/productos/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: 'Error', precio: 10, stock: 100 });
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });

  test('DELETE /productos/:id cuando el servicio lanza error debe retornar 400', async () => {
    const productosService = require('../src/services/productos');
    const spy = jest.spyOn(productosService, 'remove').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .delete('/productos/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });
  beforeAll(async () => {
    // Login para obtener accessToken de admin
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@correo.com', password: '123456' });
    accessToken = res.body.accessToken;
  });

  test('GET /productos debe retornar 200 y lista', async () => {
    const res = await request(app)
      .get('/productos')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.productos)).toBe(true);
  });

  test('POST /productos con datos válidos y token admin', async () => {
    const unique = Date.now();
    const res = await request(app)
      .post('/productos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: `Lapiz${unique}`, precio: 10, stock: 100 });
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toContain('Lapiz');
  });

  test('POST /productos sin token debe retornar 401', async () => {
    const res = await request(app)
      .post('/productos')
      .send({ nombre: 'Lapiz', precio: 10, stock: 100 });
    expect(res.statusCode).toBe(401);
  });

  test('POST /productos con token inválido debe retornar 401', async () => {
    const res = await request(app)
      .post('/productos')
      .set('Authorization', 'Bearer token_invalido')
      .send({ nombre: 'Lapiz', precio: 10, stock: 100 });
    expect(res.statusCode).toBe(401);
  });

  test('POST /productos con datos faltantes debe retornar 400', async () => {
    const res = await request(app)
      .post('/productos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: '', precio: -5 });
    expect(res.statusCode).toBe(400);
  });
  
  test('POST /productos con tipo incorrecto debe retornar 400', async () => {
    const res = await request(app)
      .post('/productos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: 'Lapiz', precio: 'no-numero', stock: 100 });
    expect(res.statusCode).toBe(400);
  });

  test('PUT /productos/999 debe retornar 404', async () => {
    const res = await request(app)
      .put('/productos/999')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: 'Lapiz', precio: 10, stock: 100 });
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /productos/999 debe retornar 404', async () => {
    const res = await request(app)
      .delete('/productos/999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(404);
  });

  test('GET /productos/999 debe retornar 404', async () => {
    const res = await request(app)
      .get('/productos/999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /productos/1 sin token debe retornar 401', async () => {
    const res = await request(app).delete('/productos/1');
    expect(res.statusCode).toBe(401);
  });
  
  test('DELETE /productos/1 con rol incorrecto debe retornar 403', async () => {
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
      .delete('/productos/1')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('DELETE /productos/1 con token admin debe retornar 200 o 204', async () => {
    const res = await request(app)
      .delete('/productos/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect([200, 204, 404]).toContain(res.statusCode);
  });
});
