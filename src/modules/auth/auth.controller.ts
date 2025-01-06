import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '@le-common/decorators/public.decorator';
import { Roles } from '@le-common/decorators/roles.decorator';
import { Role } from '@le-common/enums/role.enum';
import { RolesGuard } from '@le-common/guards/roles.guard';
import { LogoutUserUseCase } from '@le-core/use-cases/logout.use-case';
import { JwtAuthGuard } from '@le-guards/jwt-auth.guard';
import { ApiGetMeResponse } from '@le-modules/users/swagger/api.get.me.swagger';
import { AuthenticateUserUseCase } from '@le-use-cases/authenticate-user.use-case';
import { GetUserByIdUseCase } from '@le-use-cases/get-user-by-id.use-case';

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
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
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
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiBearerAuth()
  async logout(@Req() req: any) {
    return this.logoutUserUseCase.execute(req.headers?.authorization);
  }
}
