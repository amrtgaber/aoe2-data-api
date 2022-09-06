import { INestApplication, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url:
            config.get('DATABASE_URL') ||
            /* istanbul ignore next */
            process.env.HEROKU_POSTGRESQL_MAROON_URL,
        },
      },
    });
  }

  async cleanDb() {
    await this.unit.deleteMany();
    await this.tech.deleteMany();
    await this.building.deleteMany();
    await this.civ.deleteMany();
    await this.age.deleteMany();
  }

  /* istanbul ignore next */
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
