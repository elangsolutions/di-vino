import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  register(@Args('input') input: RegisterInput) {
    return this.authService.register(input.email, input.password);
  }

  @Mutation(() => String)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input.email, input.password);
  }
}
