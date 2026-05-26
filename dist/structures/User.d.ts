import { PelicanApp } from '../application/PelicanApp';
import { UserData, CreateUserOptions, RoleData } from '../types';
export declare class User {
    private app;
    readonly id: number;
    readonly externalId?: string;
    readonly uuid: string;
    readonly username: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly language: string;
    readonly rootAdmin: boolean;
    readonly role: string;
    readonly roles: RoleData[];
    readonly twoFactorEnabled: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(app: PelicanApp, data: UserData);
    /**
     * Extrait le rôle principal depuis les données
     */
    private extractPrimaryRole;
    /**
     * Supprime cet utilisateur
     */
    delete(): Promise<void>;
    /**
     * Met à jour cet utilisateur
     */
    update(options: Partial<CreateUserOptions>): Promise<User>;
    /**
     * Obtient le nom complet de l'utilisateur
     */
    get fullName(): string;
    /**
     * Vérifie si l'utilisateur a un rôle spécifique par nom
     */
    hasRole(roleName: string): boolean;
    /**
     * Vérifie si l'utilisateur a un rôle spécifique par ID
     */
    hasRoleId(roleId: number): boolean;
    /**
     * Vérifie si l'utilisateur est administrateur
     */
    get isAdmin(): boolean;
    /**
     * Vérifie si l'utilisateur est modérateur
     */
    get isModerator(): boolean;
    /**
     * Obtient la liste des noms de rôles
     */
    get roleNames(): string[];
    /**
     * Obtient le rôle principal (premier rôle ou le plus important)
     */
    get primaryRole(): RoleData | null;
}
//# sourceMappingURL=User.d.ts.map