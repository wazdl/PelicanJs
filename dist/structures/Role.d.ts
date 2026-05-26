import { PelicanApp } from '../application/PelicanApp';
import { RoleData } from '../types';
export declare class Role {
    private app;
    readonly id: number;
    readonly name: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(app: PelicanApp, data: RoleData);
    /**
     * Supprime ce rôle
     */
    delete(): Promise<void>;
    /**
     * Met à jour ce rôle
     */
    update(options: {
        name?: string;
    }): Promise<Role>;
    /**
     * Vérifie si c'est un rôle administrateur
     */
    get isAdmin(): boolean;
    /**
     * Vérifie si c'est un rôle modérateur
     */
    get isModerator(): boolean;
}
//# sourceMappingURL=Role.d.ts.map