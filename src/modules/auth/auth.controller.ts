import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '@lesechos/common/decorators/public.decorator';
import { Roles } from '@lesechos/common/decorators/roles.decorator';
import { ROLE } from '@lesechos/common/enums/role.enum';
import { AuthenticateUserUseCase } from '@lesechos/modules/auth/use-cases/authenticate-user.use-case';
import { ApiGetMeResponse } from '@lesechos/modules/users/swagger/api.get.me.swagger';
import { GetUserByIdUseCase } from '@lesechos/modules/users/use-cases/get-user-by-id.use-case';
import { LogoutUserUseCase } from '@lesechos/modules/users/use-cases/logout.use-case';

@ApiTags('Authentication') // Group under "Authentication" in Swagger
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase
  ) {}

  /**
   * User Login Endpoint
   * @param body - Contains username and password
   * @returns JWT token if credentials are valid
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    description: 'Provide username and password to login',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'testuser' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  async login(@Body() { username, password }: { username: string; password: string }) {
    return this.authenticateUserUseCase.execute({ username, password });
  }

  /**
   * Get Current User Information
   * Accessible to both Admin and User roles.
   * @returns User details
   */
  @Roles(ROLE.USER, ROLE.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current USER information' })
  @ApiGetMeResponse()
  @Get('me')
  async getCurrentUser(@Req() req: any) {
    return this.getUserByIdUseCase.execute(req?.user?.id);
  }

  /**
   * User Logout Endpoint
   * @param req - Request containing user information
   * @returns Logout confirmation message
   */
  @Roles(ROLE.USER, ROLE.ADMIN)
  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiBearerAuth()
  async logout(@Req() req: any) {
    return this.logoutUserUseCase.execute(req.headers?.authorization);
  }
}
