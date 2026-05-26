import { PelicanApp } from '../application/PelicanApp';
import { Role } from '../structures/Role';
export declare class RoleManager {
    private app;
    constructor(app: PelicanApp);
    /**
     * Récupère un rôle par son ID
     */
    fetch(id: number): Promise<Role>;
    /**
     * Récupère tous les rôles via l'endpoint /roles
     */
    fetchAll(): Promise<Role[]>;
    /**
     * Méthode de fallback : récupère tous les rôles en testant les IDs de 1 à 100
     * Utilisée si l'endpoint /roles n'est pas disponible
     */
    private fetchAllByIds;
    /**
     * Crée un nouveau rôle
     */
    create(options: {
        name: string;
    }): Promise<Role>;
    /**
     * Supprime un rôle
     */
    delete(id: number): Promise<void>;
    /**
     * Met à jour un rôle
     */
    update(id: number, options: {
        name?: string;
    }): Promise<Role>;
}
//# sourceMappingURL=RoleManager.d.ts.map