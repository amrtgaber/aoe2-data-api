import { AuthGuard } from '@nestjs/passport';

export class AccessGuard extends AuthGuard('access') {
  constructor() {
    super();
  }
}
