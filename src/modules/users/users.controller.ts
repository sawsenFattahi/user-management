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

import { Public } from '@lesechos/common/decorators/public.decorator';
import { Roles } from '@lesechos/common/decorators/roles.decorator';
import { ROLE } from '@lesechos/common/enums/role.enum';
import { JwtAuthGuard } from '@lesechos/common/guards/jwt-auth.guard';
import { RolesGuard } from '@lesechos/common/guards/roles.guard';
import { CreateUserDto } from '@lesechos/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@lesechos/modules/users/dto/update-user.dto';
import { UserDto } from '@lesechos/modules/users/dto/user.dto';
import { DeleteUserUseCase } from '@lesechos/modules/users/use-cases/delete-user.use-case';
import { GetAllUsersUseCase } from '@lesechos/modules/users/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '@lesechos/modules/users/use-cases/get-user-by-id.use-case';
import { RegisterUserUseCase } from '@lesechos/modules/users/use-cases/register-user.use-case';
import { UpdateUserUseCase } from '@lesechos/modules/users/use-cases/update-user.use-case';

import {
  ApiCreateUserBody,
  ApiCreateUserResponse,
  ApiDeleteUserResponse,
  ApiFindAllUsersResponse,
  ApiGetOneUserResponse,
  ApiUpdateUserBody,
  ApiUpdateUserResponse,
} from './swagger';

@ApiTags('Users') // Group under "Users" in Swagger
@Controller('users')
export class UsersController {
  constructor(
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
    return this.registerUserUseCase.execute(createUserDto);
  }

  /**
   * Update current user's information
   * Accessible to both Admin and User roles.
   * @param req - Request object containing user details
   * @param updates - Partial user details to update
   * @returns The updated user object
   */
  @Roles(ROLE.USER, ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user information' })
  @ApiUpdateUserBody()
  @ApiUpdateUserResponse()
  @Patch('me')
  async updateCurrentUser(@Req() req: any, @Body() updates: UpdateUserDto): Promise<UserDto> {
    return this.updateUserUseCase.execute(req?.user?.id, updates);
  }

  /**
   * Get a user by UID
   * Accessible to Admin role only.
   * @param uid - User ID
   * @returns The user object
   */
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by UID' })
  @ApiGetOneUserResponse()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUserByIdUseCase.execute(id);
  }

  /**
   * Get a list of all users
   * Accessible to Admin role only.
   * @param filters - JSON string of filters
   * @param sort - JSON string for sorting
   * @returns List of users
   */
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of all users' })
  @ApiFindAllUsersResponse()
  @Get('')
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
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user by UID (Admin only)' })
  @ApiUpdateUserBody()
  @ApiUpdateUserResponse()
  @Patch(':id')
  async updateUserByAdmin(@Param('id') id: string, @Body() updates: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, updates);
  }

  /**
   * Delete a user by UID
   * Accessible to Admin role only.
   * @param id - User ID
   * @returns A confirmation message
   */
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by ID (Admin only)' })
  @ApiDeleteUserResponse()
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
