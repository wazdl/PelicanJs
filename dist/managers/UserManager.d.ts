import { PelicanApp } from '../application/PelicanApp';
import { User } from '../structures/User';
import { CreateUserOptions, RoleData } from '../types';
export declare class UserManager {
    private app;
    constructor(app: PelicanApp);
    /**
     * Récupère un utilisateur par son ID
     */
    fetch(id: number): Promise<User>;
    /**
     * Récupère tous les utilisateurs
     */
    fetchAll(): Promise<User[]>;
    /**
     * Récupère tous les rôles disponibles
     */
    fetchRoles(): Promise<RoleData[]>;
    /**
     * Crée un nouvel utilisateur avec le système de rôles Pelican
     */
    create(options: CreateUserOptions): Promise<User>;
    /**
     * Supprime un utilisateur
     */
    delete(id: number): Promise<void>;
    /**
     * Met à jour un utilisateur
     */
    update(id: number, options: Partial<CreateUserOptions>): Promise<User>;
    /**
     * Assigne un rôle à un utilisateur
     */
    assignRole(userId: number, roleId: number): Promise<void>;
    /**
     * Retire un rôle d'un utilisateur
     */
    removeRole(userId: number, roleId: number): Promise<void>;
}
//# sourceMappingURL=UserManager.d.ts.map