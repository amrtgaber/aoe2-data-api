import * as pactum from 'pactum';
import * as argon from 'argon2';

import { AuthDto } from '../src/auth/dto/auth.dto';
import { PrismaService } from '../src/prisma/prisma.service';

export async function login(prisma: PrismaService) {
  const user: AuthDto = {
    email: 'test@test.com',
    password: '111',
  };

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

  await pactum
    .spec()
    .post('/auth/login')
    .withBody(user)
    .stores('userAccessToken', 'access_token');
}
