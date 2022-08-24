import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateBuildingDto } from '../../src/building/dto/create-building.dto';
import { UpdateBuildingDto } from '../../src/building/dto/update-building.dto';
import { ConfigService } from '@nestjs/config';
import { login } from '../shared-test-functions';

describe('Buildings e2e', () => {
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
    const TEST_PORT = parseInt(config.get('TEST_PORT')!) + 4;

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

  describe('Buildings', () => {
    const createBuildingDto: CreateBuildingDto = {
      buildingName: 'house',
    };

    const updateBuildingDto: UpdateBuildingDto = {
      buildingName: 'castle',
    };

    describe('get empty buildings list', () => {
      it('should get empty list of buildings', async () => {
        return pactum.spec().get('/buildings').expectStatus(200).expectBody([]);
      });
    });

    describe('create building', () => {
      it('should create building', async () => {
        return pactum
          .spec()
          .post('/buildings')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(createBuildingDto)
          .expectStatus(201)
          .stores('buildingId', 'id');
      });
    });

    describe('get buildings', () => {
      it('should get buildings', async () => {
        return pactum
          .spec()
          .get('/buildings')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('get building by id', () => {
      it('should get a building by id', async () => {
        return pactum
          .spec()
          .get('/buildings/{id}')
          .withPathParams('id', '$S{buildingId}')
          .expectStatus(200)
          .expectBodyContains('$S{buildingId}');
      });
    });

    describe('edit building by id', () => {
      it('should edit a building', async () => {
        return pactum
          .spec()
          .patch('/buildings/{id}')
          .withPathParams('id', '$S{buildingId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(updateBuildingDto)
          .expectStatus(200)
          .expectBodyContains(updateBuildingDto.buildingName);
      });
    });

    describe('delete building by id', () => {
      it('should delete a building', async () => {
        return pactum
          .spec()
          .delete('/buildings/{id}')
          .withPathParams('id', '$S{buildingId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(204);
      });
    });

    describe('get empty buildings after delete', () => {
      it('should get empty buildings after delete', async () => {
        return pactum
          .spec()
          .get('/buildings')
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
