import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { CivEntity } from '../src/civ/entities/civ.entity';
import { CreateDraftDto } from '../src/draft/dto/create-draft.dto';
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
    await prisma.deleteUsers();

    pactum.request.setBaseUrl(TEST_API_BASE_URL);
    const civs = await prisma.civ.findMany();
    console.log({ civs });
  });

  afterAll(() => {
    app.close();
  });

  it('starts up', async () => {
    const civs = await prisma.civ.findMany();
    console.log({ civs });

    expect(app).toBeDefined();
  });

  const authDto: AuthDto = {
    email: 'test@test.com',
    username: 'testUsername',
    password: '12345678',
  };

  describe('Auth', () => {
    it('should sign up', async () => {
      // await pactum.spec().get(`/civs`).expectStatus(HttpStatus.OK).inspect();

      await pactum
        .spec()
        .post(`/auth/signup`)
        .withBody(authDto)
        .expectStatus(HttpStatus.CREATED);
    });

    it('should throw if password is too short', async () => {
      await pactum
        .spec()
        .post(`/auth/signup`)
        .withBody({ ...authDto, password: '123' })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should throw if username is too short', async () => {
      await pactum
        .spec()
        .post(`/auth/signup`)
        .withBody({ ...authDto, username: 'a' })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should throw if username is not valid', async () => {
      await pactum
        .spec()
        .post(`/auth/signup`)
        .withBody({ ...authDto, username: 'abcdefg!%$' })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should login', async () => {
      await pactum
        .spec()
        .post(`/auth/login`)
        .withBody(authDto)
        .expectStatus(HttpStatus.OK)
        .stores('accessToken', 'access_token');
    });

    it('should throw if email empty', async () => {
      await pactum
        .spec()
        .post(`/auth/signup`)
        .withBody({
          password: authDto.password,
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should throw if password is empty', async () => {
      await pactum
        .spec()
        .post(`/auth/signup`)
        .withBody({
          email: authDto.email,
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

    it('edits user email', async () => {
      await pactum
        .spec()
        .patch(`/users`)
        .withBody({
          email: 'test2@test.com',
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.OK);
    });

    it('edits user password', async () => {
      await pactum
        .spec()
        .patch(`/users`)
        .withBody({
          password: 'a different password',
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.OK);
    });

    it('logs in after email and password changed', async () => {
      await pactum
        .spec()
        .post(`/auth/login`)
        .withBody({
          email: 'test2@test.com',
          password: 'a different password',
        })
        .expectStatus(HttpStatus.OK);
    });

    it('throws if password is too short', async () => {
      await pactum
        .spec()
        .patch(`/users`)
        .withBody({
          password: '123',
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('throws if username is too short', async () => {
      await pactum
        .spec()
        .patch(`/users`)
        .withBody({
          username: 'a',
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('throws if username is not valid', async () => {
      await pactum
        .spec()
        .patch(`/users`)
        .withBody({
          username: 'abcdefg!%$',
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('edits user username', async () => {
      await pactum
        .spec()
        .patch(`/users`)
        .withBody({
          username: 'test2Username',
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.OK);
    });

    it('throws if username is too short', async () => {
      await pactum
        .spec()
        .patch(`/users`)
        .withBody({
          username: 'a',
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('deletes user', async () => {
      await pactum
        .spec()
        .delete(`/users`)
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT);
    });
  });

  describe('Draft', () => {
    const draftDto: CreateDraftDto = {
      name: 'draft name',
      desc: 'draft desc',
      private: true,
      civs: [{ civName: 'Aztecs' }] as CivEntity[],
    };

    it('creates a draft', async () => {
      // recreate deleted user
      await pactum
        .spec()
        .post(`/auth/signup`)
        .withBody(authDto)
        .expectStatus(HttpStatus.CREATED);

      await pactum
        .spec()
        .post(`/auth/login`)
        .withBody(authDto)
        .expectStatus(HttpStatus.OK)
        .stores('accessToken', 'access_token');

      // await pactum.spec().get(`/civs`).expectStatus(HttpStatus.OK).inspect();

      // create draft
      // await pactum
      //   .spec()
      //   .post(`/drafts`)
      //   .withBody(draftDto)
      //   .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
      //   .expectStatus(HttpStatus.CREATED);
    });

    it.todo('gets all drafts');
    it.todo('gets a draft by id');
    it.todo('edits a draft');
    it.todo('delets a draft');
  });
});
