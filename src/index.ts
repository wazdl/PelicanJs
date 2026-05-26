export { PelicanClient } from './client/PelicanClient';
export { PelicanApp } from './application/PelicanApp';
export { ServerManager } from './managers/ServerManager';
export { UserManager } from './managers/UserManager';
export { RoleManager } from './managers/RoleManager';
export { Server } from './structures/Server';
export { User } from './structures/User';
export { Role } from './structures/Role';
export * from './types/index';

// Exporter les constantes de rôles
export const PelicanRoles = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
} as const;