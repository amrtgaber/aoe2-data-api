import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import * as argon from 'argon2';

import { AppModule } from '../../src/app.module';
import { AuthDto } from '../../src/auth/dto/auth.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('Auth e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      providers: [ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const config = moduleFixture.get<ConfigService>(ConfigService);
    const TEST_PORT = config.get('TEST_PORT');

    await app.listen(TEST_PORT);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl(`http://localhost:${TEST_PORT}`);
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    // hardcode authorized user
    const user: AuthDto = {
      email: 'test@test.com',
      password: '111',
    };

    beforeAll(async () => {
      const hash: string = await argon.hash(user.password);

      try {
        await prisma.user.create({
          data: {
            email: user.email,
            hash,
          },
        });
      } catch (e) {
        // ignore unique constraint error
      }
    });

    describe('login', () => {
      it('should throw if email empty', async () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ password: user.password })
          .expectStatus(400);
      });

      it('should throw if password empty', async () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: user.email })
          .expectStatus(400);
      });

      it('should throw if body empty', async () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });

      it('should sign in', async () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(user)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });
    });
  });
});
