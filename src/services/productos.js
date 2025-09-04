
// Simulación de base de datos en memoria
let productos = [];
let idCounter = 1;

function getAll({ page = 1, limit = 10, sort }) {
  let result = [...productos];
  // Ordenamiento
  if (sort) {
    const [campo, orden] = sort.split(',');
    result.sort((a, b) => {
      if (orden === 'desc') return b[campo] - a[campo];
      return a[campo] - b[campo];
    });
  }
  // Paginación
  const start = (page - 1) * limit;
  const end = start + Number(limit);
  return {
    total: result.length,
    page: Number(page),
    limit: Number(limit),
    productos: result.slice(start, end)
  };
}

function getById(id) {
  return productos.find(p => p.id === Number(id));
}

function create(datos) {
  const nuevo = {
    id: idCounter++,
    ...datos,
    creadoEn: new Date().toISOString()
  };
  productos.push(nuevo);
  return nuevo;
}

function update(id, datos) {
  const idx = productos.findIndex(p => p.id === Number(id));
  if (idx === -1) return null;
  productos[idx] = { ...productos[idx], ...datos };
  return productos[idx];
}

function remove(id) {
  const idx = productos.findIndex(p => p.id === Number(id));
  if (idx === -1) return null;
  productos.splice(idx, 1);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
