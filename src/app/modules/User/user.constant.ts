export const Role = {
  admin: 'admin',
  user: 'user',
} as const;

export type RoleType = keyof typeof Role;
