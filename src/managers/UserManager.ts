import { PelicanApp } from '../application/PelicanApp';
import { User } from '../structures/User';
import { UserData, CreateUserOptions, ApiResponse, PaginatedResponse, RoleData } from '../types';

export class UserManager {
  constructor(private app: PelicanApp) {}

  /**
   * Récupère un utilisateur par son ID
   */
  async fetch(id: number): Promise<User> {
    const response = await this.app.get<ApiResponse<UserData>>(`/users/${id}`);
    return new User(this.app, response.attributes);
  }

  /**
   * Récupère tous les utilisateurs
   */
  async fetchAll(): Promise<User[]> {
    const response = await this.app.get<PaginatedResponse<UserData>>('/users');
    return response.data.map(user => new User(this.app, user.attributes));
  }

  /**
   * Récupère tous les rôles disponibles
   */
  async fetchRoles(): Promise<RoleData[]> {
    // Utiliser le RoleManager dédié
    const roles = await this.app.roles.fetchAll();
    return roles.map(role => ({
      id: role.id,
      name: role.name,
      created_at: role.createdAt.toISOString(),
      updated_at: role.updatedAt?.toISOString()
    }));
  }

  /**
   * Crée un nouvel utilisateur avec le système de rôles Pelican
   */
  async create(options: CreateUserOptions): Promise<User> {
    // Convertir le rôle string en format attendu par l'API
    let roleData = {};
    
    if (options.role) {
      // Si un rôle simple est fourni, l'utiliser directement
      roleData = { role: options.role };
    } else if (options.roles && options.roles.length > 0) {
      // Si des IDs de rôles sont fournis, les utiliser
      roleData = { roles: options.roles };
    } else {
      // Rôle par défaut
      roleData = { role: 'user' };
    }

    const userData = {
      username: options.username,
      email: options.email,
      password: options.password,
      first_name: options.first_name || options.username,
      last_name: options.last_name || '',
      ...roleData
    };

    const response = await this.app.post<ApiResponse<UserData>>('/users', userData);
    return new User(this.app, response.attributes);
  }

  /**
   * Supprime un utilisateur
   */
  async delete(id: number): Promise<void> {
    await this.app.delete(`/users/${id}`);
  }

  /**
   * Met à jour un utilisateur
   */
  async update(id: number, options: Partial<CreateUserOptions>): Promise<User> {
    const response = await this.app.put<ApiResponse<UserData>>(`/users/${id}`, options);
    return new User(this.app, response.attributes);
  }

  /**
   * Assigne un rôle à un utilisateur
   */
  async assignRole(userId: number, roleId: number): Promise<void> {
    await this.app.post(`/users/${userId}/roles`, { role: roleId });
  }

  /**
   * Retire un rôle d'un utilisateur
   */
  async removeRole(userId: number, roleId: number): Promise<void> {
    await this.app.delete(`/users/${userId}/roles/${roleId}`);
  }
}