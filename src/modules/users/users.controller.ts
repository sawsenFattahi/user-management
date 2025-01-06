import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '@le-common/decorators/public.decorator';
import { Role } from '@le-common/enums/role.enum';
import { DeleteUserUseCase } from '@le-core/use-cases/delete-user.use-case';
import { UpdateUserUseCase } from '@le-core/use-cases/update-user.use-case';
import { Roles } from '@le-decorators/roles.decorator';
import { User } from '@le-entities/user.entity';
import { JwtAuthGuard } from '@le-guards/jwt-auth.guard';
import { RolesGuard } from '@le-guards/roles.guard';
import { UserRepositoryAdapter } from '@le-repositories/user-repository.adapter';
import { GetAllUsersUseCase } from '@le-use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '@le-use-cases/get-user-by-id.use-case';
import { RegisterUserUseCase } from '@le-use-cases/register-user.use-case';
import { CreateUserDto } from '@le-users/dto/create-user.dto';
import { UpdateUserDto } from '@le-users/dto/update-user.dto';
import {
  ApiFindAllUsersResponse,
  ApiUpdateUserBody,
  ApiUpdateUserResponse,
  ApiCreateUserBody,
  ApiCreateUserResponse,
  ApiGetOneUserResponse,
  ApiDeleteUserResponse,
} from '@le-users/swagger';

@ApiTags('Users') // Group under "Users" in Swagger
@Controller('users')
export class UsersController {
  constructor(
    private readonly userRepository: UserRepositoryAdapter,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  /**
   * Create a new user
   * @param createUserDto - User details for creation
   * @returns The created user object
   */
  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreateUserBody()
  @ApiCreateUserResponse()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.registerUserUseCase.execute(createUserDto as User);
  }

  /**
   * Update current user's information
   * Accessible to both Admin and User roles.
   * @param req - Request object containing user details
   * @param updates - Partial user details to update
   * @returns The updated user object
   */
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user information' })
  @ApiUpdateUserBody()
  @ApiUpdateUserResponse()
  @Patch('me')
  async updateCurrentUser(@Req() req: any, @Body() updates: UpdateUserDto) {
    return this.updateUserUseCase.execute(req?.user?.id, updates);
  }

  /**
   * Get a user by UID
   * Accessible to Admin role only.
   * @param uid - User ID
   * @returns The user object
   */
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by UID' })
  @ApiGetOneUserResponse()
  @Get('admin/:id')
  async findOne(@Param('id') id: string) {
    console.log('id from controller', id);
    return this.getUserByIdUseCase.execute(id);
  }

  /**
   * Get a list of all users
   * Accessible to Admin role only.
   * @param filters - JSON string of filters
   * @param sort - JSON string for sorting
   * @returns List of users
   */
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of all users' })
  @ApiFindAllUsersResponse()
  @Get('admin')
  async findAll(@Query('filters') filters: string, @Query('sort') sort: string) {
    return this.getAllUsersUseCase.execute({ filters, sort });
  }

  /**
   * Update a user by UID
   * Accessible to Admin role only.
   * @param uid - User ID
   * @param updateUserDto - Updated user details
   * @returns The updated user object
   */
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user by UID (Admin only)' })
  @ApiUpdateUserBody()
  @ApiUpdateUserResponse()
  @Patch('admin/:id')
  async updateUserByAdmin(@Param('id') id: string, @Body() updates: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, updates);
  }

  /**
   * Delete a user by UID
   * Accessible to Admin role only.
   * @param id - User ID
   * @returns A confirmation message
   */
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by ID (Admin only)' })
  @ApiDeleteUserResponse()
  @Delete('admin/:id')
  async deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
