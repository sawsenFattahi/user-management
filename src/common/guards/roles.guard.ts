import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@le-common/enums/role.enum';
import { UserRepositoryAdapter } from '@le-repositories/user-repository.adapter';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userRepository: UserRepositoryAdapter
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required roles from metadata
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Allow access if no roles are defined
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('User not found in request');
    }
    //get frech user
    const frechUser = await this.userRepository.findById(user.id);
    if (!frechUser) {
      throw new ForbiddenException('User not found');
    }

    // Check if user's role is in the required roles
    const hasRole = requiredRoles.includes(frechUser.role as Role);
    console.log('frech user', frechUser.role);
    if (!hasRole) {
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }

    return true; // Grant access if user has one of the required roles
  }
}
