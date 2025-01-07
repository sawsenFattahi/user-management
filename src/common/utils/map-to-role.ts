import { BadRequestException } from '@nestjs/common';

import { ROLE } from '@lesechos/common/enums/role.enum';

import type { Role } from '@lesechos/common/enums/role.enum';

export function mapToRole(value: Role): Role {
  if (!Object.values(ROLE).includes(value as Role)) {
    throw new BadRequestException(`Invalid role: ${value}`);
  }

  return value as Role;
}
