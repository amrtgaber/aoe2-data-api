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

  // FOR TESTING ONLY
  async deleteUsers() {
    await this.user.deleteMany();
  }

  /* istanbul ignore next */
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
