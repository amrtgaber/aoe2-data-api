import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateUnitDto } from '../../src/unit/dto/create-unit.dto';
import { UpdateUnitDto } from '../../src/unit/dto/update-unit.dto';
import { ConfigService } from '@nestjs/config';
import { login } from '../shared-test-functions';

describe('Units e2e', () => {
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
    const TEST_PORT = parseInt(config.get('TEST_PORT')!) + 2;

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
    const createUnitDto: CreateUnitDto = {
      unitName: 'archer',
    };

    const updateUnitDto: UpdateUnitDto = {
      unitName: 'skirmisher',
    };

    describe('get empty units list', () => {
      it('should get empty list of units', async () => {
        return pactum.spec().get('/units').expectStatus(200).expectBody([]);
      });
    });

    describe('create unit', () => {
      it('should create unit', async () => {
        return pactum
          .spec()
          .post('/units')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(createUnitDto)
          .expectStatus(201)
          .stores('unitId', 'id');
      });
    });

    describe('get units', () => {
      it('should get units', async () => {
        return pactum
          .spec()
          .get('/units')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('get unit by id', () => {
      it('should get a unit by id', async () => {
        return pactum
          .spec()
          .get('/units/{id}')
          .withPathParams('id', '$S{unitId}')
          .expectStatus(200)
          .expectBodyContains('$S{unitId}');
      });
    });

    describe('edit unit by id', () => {
      it('should edit a unit', async () => {
        return pactum
          .spec()
          .patch('/units/{id}')
          .withPathParams('id', '$S{unitId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(updateUnitDto)
          .expectStatus(200)
          .expectBodyContains(updateUnitDto.unitName);
      });
    });

    describe('delete unit by id', () => {
      it('should delete a unit', async () => {
        return pactum
          .spec()
          .delete('/units/{id}')
          .withPathParams('id', '$S{unitId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(204);
      });
    });

    describe('get empty units after delete', () => {
      it('should get empty units after delete', async () => {
        return pactum
          .spec()
          .get('/units')
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
