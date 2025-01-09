import { Injectable, ExecutionContext, UnauthorizedException, UseGuards, Controller, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   // Optionally override the canActivate method if custom behavior is needed
//   canActivate(context: ExecutionContext) {
//     // Add your custom logic here, e.g., logging or other validation
//     return super.canActivate(context);
//   }

//   handleRequest(err, user, info, context: ExecutionContext) {
//     if (err || !user) {
//       // If there's an error or no user, throw an unauthorized exception
//       throw err || new UnauthorizedException('Unauthorized');
//     }
//     return user;
//   }
// }

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@UseGuards(JwtAuthGuard)
@Controller('protected')
export class ProtectedController {
  @Get()
  getProtectedData() {
    return { message: 'You are authenticated!' };
  }
}