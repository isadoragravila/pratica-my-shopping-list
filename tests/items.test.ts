import supertest from 'supertest';
import app from '../src/app';
import { prisma } from '../src/database';
import { itemFactory } from './factories/itemFactory';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE items RESTART IDENTITY;`;
});

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () =>{
    const body = itemFactory();

    const result = await supertest(app).post('/items').send(body);
    const createdItem = await prisma.items.findUnique({
      where: { title: body.title }
    })

    expect(result.status).toBe(201);
    expect(createdItem).not.toBeNull;
  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async  () => {
    const body = itemFactory();

    await supertest(app).post('/items').send(body);

    const result = await supertest(app).post('/items').send(body);
    expect(result.status).toBe(409);
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const body = itemFactory();

    await supertest(app).post('/items').send(body);
    
    const result = await supertest(app).get('/items');
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const body = itemFactory();

    await supertest(app).post('/items').send(body);

    const item = await prisma.items.findUnique({
      where: { title: body.title }
    });

    const result = await supertest(app).get(`/items/${item.id}`);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(item);
  });

  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const result = await supertest(app).get('/items/1');

    expect(result.status).toBe(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});