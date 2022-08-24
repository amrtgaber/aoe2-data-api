import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateCivDto } from '../../src/civ/dto/create-civ.dto';
import { UpdateCivDto } from '../../src/civ/dto/update-civ.dto';
import { ConfigService } from '@nestjs/config';
import { login } from '../shared-test-functions';

describe('Civs e2e', () => {
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
    const TEST_PORT = parseInt(config.get('TEST_PORT')!) + 1;

    await app.listen(TEST_PORT);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl(`http://localhost:${TEST_PORT}`);
  });

  beforeEach(async () => {
    await login(prisma);
  });

  afterAll(() => {
    app.close();
  });

  describe('Units', () => {
    const createCivDto: CreateCivDto = {
      civName: 'Aztecs',
    };

    const updateCivDto: UpdateCivDto = {
      civName: 'Vikings',
    };

    describe('get empty civs list', () => {
      it('should get empty list of civs', async () => {
        return pactum.spec().get('/civs').expectStatus(200).expectBody([]);
      });
    });

    describe('create civ', () => {
      it('should create civ', async () => {
        return pactum
          .spec()
          .post('/civs')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(createCivDto)
          .expectStatus(201)
          .stores('civId', 'id');
      });
    });

    describe('get civs', () => {
      it('should get civs', async () => {
        return pactum.spec().get('/civs').expectStatus(200).expectJsonLength(1);
      });
    });

    describe('get civ by id', () => {
      it('should get a civ by id', async () => {
        return pactum
          .spec()
          .get('/civs/{id}')
          .withPathParams('id', '$S{civId}')
          .expectStatus(200)
          .expectBodyContains('$S{civId}');
      });
    });

    describe('edit civ by id', () => {
      it('should edit a civ', async () => {
        return pactum
          .spec()
          .patch('/civs/{id}')
          .withPathParams('id', '$S{civId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(updateCivDto)
          .expectStatus(200)
          .expectBodyContains(updateCivDto.civName);
      });
    });

    describe('delete civ by id', () => {
      it('should delete a civ', async () => {
        return pactum
          .spec()
          .delete('/civs/{id}')
          .withPathParams('id', '$S{civId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(204);
      });
    });

    describe('get empty civs after delete', () => {
      it('should get empty civs after delete', async () => {
        return pactum.spec().get('/civs').expectStatus(200).expectJsonLength(0);
      });
    });
  });
});
