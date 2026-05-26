import { PelicanApp } from '../application/PelicanApp';
import { RoleData } from '../types';

export class Role {
  public readonly id: number;
  public readonly name: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(private app: PelicanApp, data: RoleData) {
    this.id = data.id;
    this.name = data.name;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);
  }

  /**
   * Supprime ce rôle
   */
  async delete(): Promise<void> {
    return this.app.roles.delete(this.id);
  }

  /**
   * Met à jour ce rôle
   */
  async update(options: {
    name?: string;
  }): Promise<Role> {
    return this.app.roles.update(this.id, options);
  }

  /**
   * Vérifie si c'est un rôle administrateur
   */
  get isAdmin(): boolean {
    return this.name.toLowerCase().includes('admin');
  }

  /**
   * Vérifie si c'est un rôle modérateur
   */
  get isModerator(): boolean {
    return this.name.toLowerCase().includes('mod');
  }
}