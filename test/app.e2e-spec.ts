import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { PrismaService } from '../src/prisma/prisma.service';

const TEST_API_BASE_URL = `http://localhost:${process.env.TEST_PORT || 4001}`;

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
    await app.listen(process.env.TEST_PORT || 4001);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl(TEST_API_BASE_URL);
  });

  afterAll(() => {
    app.close();
  });

  it('starts up', () => {
    expect(app).toBeDefined();
  });

  const dto: AuthDto = {
    email: 'test@test.com',
    username: 'test username',
    password: '123',
  };

  describe('Auth', () => {
    it('should sign up', async () => {
      await pactum
        .spec()
        .post(`/auth/signup`)
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED);
    });

    it('should login', async () => {
      await pactum
        .spec()
        .post(`/auth/login`)
        .withBody(dto)
        .expectStatus(HttpStatus.OK)
        .stores('accessToken', 'access_token');
    });

    it('should throw if email empty', async () => {
      await pactum
        .spec()
        .post(`/auth/signup`)
        .withBody({
          password: dto.password,
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should throw if password is empty', async () => {
      await pactum
        .spec()
        .post(`/auth/signup`)
        .withBody({
          email: dto.email,
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should throw if no body', async () => {
      await pactum
        .spec()
        .post(`/auth/signup`)
        .expectStatus(HttpStatus.BAD_REQUEST);
    });
  });

  describe('User', () => {
    it('gets user', async () => {
      await pactum
        .spec()
        .get(`/users`)
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.OK);
    });

    it.todo('edits user');
    it.todo('deletes user');
  });

  describe('Draft', () => {
    it.todo('creates a draft');
    it.todo('gets all drafts');
    it.todo('gets a draft by id');
    it.todo('edits a draft');
    it.todo('delets a draft');
  });
});
