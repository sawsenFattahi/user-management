import { Controller, Post, Body, UseGuards, UnauthorizedException, Req, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthBlacklistService } from '@le-auth/auth-blacklist.service';
import { AuthService } from '@le-auth/auth.service';
import { Public } from '@le-common/decorators/public.decorator';
import { Roles } from '@le-common/decorators/roles.decorator';
import { Role } from '@le-common/enums/role.enum';
import { RolesGuard } from '@le-common/guards/roles.guard';
import { JwtAuthGuard } from '@le-guards/jwt-auth.guard';
import { ApiGetMeResponse } from '@le-modules/users/swagger/api.get.me.swagger';
import { UserRepositoryAdapter } from '@le-repositories/user-repository.adapter';

@ApiTags('Authentication') // Group under "Authentication" in Swagger
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly blacklistService: AuthBlacklistService,
    private readonly userRepository: UserRepositoryAdapter
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
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
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
    const userId = req.user?.id;
    console.log('id from controller', req.user);
    if (!userId) {
      throw new UnauthorizedException('Invalid user data');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user; // Return full user details
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
    const authHeader = req.headers?.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Blacklist the token
    await this.blacklistService.addToken(token);

    return { message: 'Logged out successfully' };
  }
}
