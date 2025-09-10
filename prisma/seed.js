const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Crear clientes
  const cliente1 = await prisma.cliente.create({
    data: {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
    },
  });
  const cliente2 = await prisma.cliente.create({
    data: {
      nombre: 'Ana Gómez',
      email: 'ana@example.com',
    },
  });

  // Crear pedidos
  await prisma.pedido.create({
    data: {
      clienteId: cliente1.id,
      fecha: new Date(),
      estado: 'pendiente',
      total: 150.5,
    },
  });
  await prisma.pedido.create({
    data: {
      clienteId: cliente2.id,
      fecha: new Date(),
      estado: 'entregado',
      total: 320.0,
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
