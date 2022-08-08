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
            process.env.HEROKU_POSTGRESQL_BROWN_URL,
        },
      },
    });
  }

  async cleanDb() {
    await this.user.deleteMany();
    await this.civ.deleteMany();
  }

  /* istanbul ignore next */
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
