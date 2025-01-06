export const ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
