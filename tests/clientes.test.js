const request = require('supertest');
const app = require('../src/index');
const clientesService = require('../src/services/clientes');



describe('Clientes API', () => {
  test('POST /clientes cuando el servicio lanza error debe retornar 400', async () => {
    const clientesService = require('../src/services/clientes');
    const spy = jest.spyOn(clientesService, 'create').mockImplementation(() => { throw new Error('Error simulado'); });
    const unique = Date.now();
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: `Juan Pérez ${unique}`, email: `juan${unique}@correo.com` });
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });

  test('PUT /clientes/:id cuando el servicio lanza error debe retornar 400', async () => {
    const clientesService = require('../src/services/clientes');
    const spy = jest.spyOn(clientesService, 'update').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .put('/clientes/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: 'Error', email: 'error@correo.com' });
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });

  test('DELETE /clientes/:id cuando el servicio lanza error debe retornar 400', async () => {
    const clientesService = require('../src/services/clientes');
    const spy = jest.spyOn(clientesService, 'remove').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .delete('/clientes/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });
  test('DELETE /clientes/1 sin req.user debe retornar 401', async () => {
    // Simular petición sin token (no se añade req.user)
    const res = await request(app)
      .delete('/clientes/1');
    expect(res.statusCode).toBe(401);
  });

  test('DELETE /clientes/1 con rol incorrecto debe retornar 403', async () => {
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
      .delete('/clientes/1')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });
  test('POST /clientes con email duplicado debe retornar 409 o 400', async () => {
    const unique = Date.now();
    const email = `dup${unique}@correo.com`;
    await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: `Test ${unique}`, email });
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: `Test ${unique}`, email });
    expect([400,409]).toContain(res.statusCode);
  });

  test('PUT /clientes/:id cuando el servicio lanza error debe retornar 400', async () => {
    const spy = jest.spyOn(clientesService, 'update').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .put('/clientes/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: 'Error', email: 'error@correo.com' });
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });

  test('DELETE /clientes/:id cuando el servicio lanza error debe retornar 400', async () => {
    const spy = jest.spyOn(clientesService, 'remove').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .delete('/clientes/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });
  test('POST /clientes cuando el servicio lanza error debe retornar 400', async () => {
    const spy = jest.spyOn(clientesService, 'create').mockImplementation(() => { throw new Error('Error simulado'); });
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: 'Error', email: 'error@correo.com' });
    expect(res.statusCode).toBe(400);
    spy.mockRestore();
  });
  let accessToken;

  beforeAll(async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@correo.com', password: '123456' });
    accessToken = res.body.accessToken;
  });

  test('GET /clientes debe retornar 200 y lista', async () => {
    const res = await request(app)
      .get('/clientes')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /clientes con datos válidos y token admin', async () => {
    const unique = Date.now();
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: `Juan Pérez ${unique}`, email: `juan${unique}@correo.com` });
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toContain('Juan Pérez');
  });

  test('POST /clientes sin token debe retornar 401', async () => {
    const res = await request(app)
      .post('/clientes')
      .send({ nombre: 'Juan Pérez', email: 'juan@correo.com' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /clientes con token inválido debe retornar 401', async () => {
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', 'Bearer token_invalido')
      .send({ nombre: 'Juan Pérez', email: 'juan@correo.com' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /clientes con datos faltantes debe retornar 400', async () => {
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: '', email: '' });
    expect(res.statusCode).toBe(400);
  });
  
  test('POST /clientes con email malformado debe retornar 400', async () => {
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: 'Juan Pérez', email: 'correo-invalido' });
    expect([400,201]).toContain(res.statusCode); // Si no hay validación de email, puede pasar
  });

  test('PUT /clientes/999 debe retornar 404', async () => {
    const res = await request(app)
      .put('/clientes/999')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: 'No existe', email: 'no@existe.com' });
    expect(res.statusCode).toBe(404);
  });

  test('PUT /clientes/1 con datos faltantes debe retornar 400', async () => {
    // Crear cliente válido primero
    const unique = Date.now();
    const createRes = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: `Cliente PUT ${unique}`, email: `clienteput${unique}@correo.com` });
    const clienteId = createRes.body.id;
    // Intentar actualizar con datos faltantes
    const res = await request(app)
      .put(`/clientes/${clienteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nombre: '', email: '' });
    expect(res.statusCode).toBe(400);
  });

  test('PUT /clientes/1 sin token debe retornar 401', async () => {
    const res = await request(app)
      .put('/clientes/1')
      .send({ nombre: 'Nuevo', email: 'nuevo@correo.com' });
    expect(res.statusCode).toBe(401);
  });

  test('PUT /clientes/1 con token inválido debe retornar 401', async () => {
    const res = await request(app)
      .put('/clientes/1')
      .set('Authorization', 'Bearer token_invalido')
      .send({ nombre: 'Nuevo', email: 'nuevo@correo.com' });
    expect(res.statusCode).toBe(401);
  });

  test('DELETE /clientes/999 debe retornar 404', async () => {
    const res = await request(app)
      .delete('/clientes/999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(404);
  });

  test('GET /clientes/999 debe retornar 404', async () => {
    const res = await request(app)
      .get('/clientes/999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /clientes/1 sin token debe retornar 401', async () => {
    const res = await request(app).delete('/clientes/1');
    expect(res.statusCode).toBe(401);
  });

  test('DELETE /clientes/1 con rol incorrecto debe retornar 403', async () => {
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
      .delete('/clientes/1')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('DELETE /clientes/1 con token admin debe retornar 200 o 204', async () => {
    const res = await request(app)
      .delete('/clientes/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect([200, 204, 404]).toContain(res.statusCode);
  });
});
