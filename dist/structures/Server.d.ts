import { PelicanClient } from '../client/PelicanClient';
import { ServerData, ServerResourcesData, AllocationData } from '../types';
export declare class Server {
    private client;
    readonly id: number;
    readonly uuid: string;
    readonly identifier: string;
    readonly name: string;
    readonly description?: string;
    readonly status?: string;
    readonly suspended: boolean;
    readonly limits: ServerData['limits'];
    readonly featureLimits: ServerData['feature_limits'];
    readonly user: number;
    readonly node: number;
    readonly allocation: number;
    readonly nest: number;
    readonly egg: number;
    readonly container: ServerData['container'];
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(client: PelicanClient, data: ServerData);
    /**
     * Récupère les ressources du serveur
     */
    fetchResources(): Promise<ServerResourcesData>;
    /**
     * Récupère les allocations réseau du serveur
     */
    fetchAllocations(): Promise<AllocationData[]>;
    /**
     * Démarre le serveur
     */
    start(): Promise<void>;
    /**
     * Arrête le serveur
     */
    stop(): Promise<void>;
    /**
     * Redémarre le serveur
     */
    restart(): Promise<void>;
    /**
     * Kill le serveur (arrêt forcé)
     */
    kill(): Promise<void>;
    /**
     * Réinstalle le serveur
     */
    reinstall(): Promise<void>;
    /**
     * Supprime définitivement le serveur
     */
    delete(force?: boolean): Promise<void>;
    /**
     * Renomme le serveur
     */
    rename(name: string): Promise<void>;
    /**
     * Change l'image Docker du serveur
     */
    setDockerImage(dockerImage: string): Promise<void>;
    /**
     * Obtient l'IP et le port principal du serveur
     */
    getConnectionInfo(): Promise<{
        ip: string;
        port: number;
    }>;
}
//# sourceMappingURL=Server.d.ts.map