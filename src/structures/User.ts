import { PelicanApp } from '../application/PelicanApp';
import { UserData, CreateUserOptions, RoleData } from '../types';

export class User {
  public readonly id: number;
  public readonly externalId?: string;
  public readonly uuid: string;
  public readonly username: string;
  public readonly email: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly language: string;
  public readonly rootAdmin: boolean; // Deprecated mais gardé pour compatibilité
  public readonly role: string; // Rôle principal
  public readonly roles: RoleData[]; // Système de rôles avancé
  public readonly twoFactorEnabled: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(private app: PelicanApp, data: UserData) {
    this.id = data.id;
    this.externalId = data.external_id;
    this.uuid = data.uuid;
    this.username = data.username;
    this.email = data.email;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.language = data.language;
    this.rootAdmin = data.root_admin; // Deprecated
    this.role = this.extractPrimaryRole(data); // Nouveau système simple
    this.roles = data.roles || []; // Nouveau système
    this.twoFactorEnabled = data['2fa'];
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);
  }

  /**
   * Extrait le rôle principal depuis les données
   */
  private extractPrimaryRole(data: UserData): string {
    // Si l'API retourne un rôle simple
    if ((data as any).role) {
      return (data as any).role;
    }
    
    // Si on a des rôles multiples, prendre le premier
    if (data.roles && data.roles.length > 0) {
      return data.roles[0].name.toLowerCase();
    }
    
    // Fallback basé sur root_admin
    return data.root_admin ? 'admin' : 'user';
  }

  /**
   * Supprime cet utilisateur
   */
  async delete(): Promise<void> {
    return this.app.users.delete(this.id);
  }

  /**
   * Met à jour cet utilisateur
   */
  async update(options: Partial<CreateUserOptions>): Promise<User> {
    return this.app.users.update(this.id, options);
  }

  /**
   * Obtient le nom complet de l'utilisateur
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique par nom
   */
  hasRole(roleName: string): boolean {
    // Vérifier le rôle principal
    if (this.role === roleName.toLowerCase()) {
      return true;
    }
    
    // Vérifier dans les rôles multiples
    return this.roles.some(role => role.name === roleName);
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique par ID
   */
  hasRoleId(roleId: number): boolean {
    return this.roles.some(role => role.id === roleId);
  }

  /**
   * Vérifie si l'utilisateur est administrateur
   */
  get isAdmin(): boolean {
    return this.rootAdmin || 
           this.role === 'admin' || 
           this.hasRole('Administrator') || 
           this.hasRole('Admin');
  }

  /**
   * Vérifie si l'utilisateur est modérateur
   */
  get isModerator(): boolean {
    return this.role === 'moderator' || 
           this.hasRole('Moderator') || 
           this.hasRole('Modérateur');
  }

  /**
   * Obtient la liste des noms de rôles
   */
  get roleNames(): string[] {
    return this.roles.map(role => role.name);
  }

  /**
   * Obtient le rôle principal (premier rôle ou le plus important)
   */
  get primaryRole(): RoleData | null {
    if (this.roles.length === 0) return null;
    
    // Prioriser les rôles admin
    const adminRole = this.roles.find(role => 
      role.name.toLowerCase().includes('admin') || 
      role.name.toLowerCase().includes('administrator')
    );
    if (adminRole) return adminRole;
    
    // Puis les modérateurs
    const modRole = this.roles.find(role => 
      role.name.toLowerCase().includes('mod') || 
      role.name.toLowerCase().includes('moderator')
    );
    if (modRole) return modRole;
    
    // Sinon le premier rôle
    return this.roles[0];
  }
}