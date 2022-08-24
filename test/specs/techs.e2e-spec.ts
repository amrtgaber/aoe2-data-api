import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateTechDto } from '../../src/tech/dto/create-tech.dto';
import { UpdateTechDto } from '../../src/tech/dto/update-tech.dto';
import { ConfigService } from '@nestjs/config';
import { login } from '../shared-test-functions';

describe('Techs e2e', () => {
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
    const TEST_PORT = parseInt(config.get('TEST_PORT')!) + 3;

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

  describe('Techs', () => {
    const createTechDto: CreateTechDto = {
      techName: 'loom',
    };

    const updateTechDto: UpdateTechDto = {
      techName: 'wheelbarrow',
    };

    describe('get empty techs list', () => {
      it('should get empty list of techs', async () => {
        return pactum.spec().get('/techs').expectStatus(200).expectBody([]);
      });
    });

    describe('create tech', () => {
      it('should create tech', async () => {
        return pactum
          .spec()
          .post('/techs')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(createTechDto)
          .expectStatus(201)
          .stores('techId', 'id');
      });
    });

    describe('get techs', () => {
      it('should get techs', async () => {
        return pactum
          .spec()
          .get('/techs')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('get tech by id', () => {
      it('should get a tech by id', async () => {
        return pactum
          .spec()
          .get('/techs/{id}')
          .withPathParams('id', '$S{techId}')
          .expectStatus(200)
          .expectBodyContains('$S{techId}');
      });
    });

    describe('edit tech by id', () => {
      it('should edit a tech', async () => {
        return pactum
          .spec()
          .patch('/techs/{id}')
          .withPathParams('id', '$S{techId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(updateTechDto)
          .expectStatus(200)
          .expectBodyContains(updateTechDto.techName);
      });
    });

    describe('delete tech by id', () => {
      it('should delete a tech', async () => {
        return pactum
          .spec()
          .delete('/techs/{id}')
          .withPathParams('id', '$S{techId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(204);
      });
    });

    describe('get empty techs after delete', () => {
      it('should get empty techs after delete', async () => {
        return pactum
          .spec()
          .get('/techs')
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
