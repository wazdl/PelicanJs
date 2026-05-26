import { PelicanClient } from '../client/PelicanClient';
import { Server } from '../structures/Server';
import { ServerResourcesData, AllocationData, PowerAction } from '../types';
import { PelicanApp } from '../application/PelicanApp';
export declare class ServerManager {
    private client;
    private app?;
    constructor(client: PelicanClient, app?: PelicanApp | undefined);
    /**
     * Récupère un serveur par son UUID
     */
    fetch(uuid: string): Promise<Server>;
    /**
     * Récupère tous les serveurs
     */
    fetchAll(): Promise<Server[]>;
    /**
     * Récupère les ressources d'un serveur
     */
    fetchResources(uuid: string): Promise<ServerResourcesData>;
    /**
     * Récupère les allocations réseau d'un serveur
     */
    fetchAllocations(uuid: string): Promise<AllocationData[]>;
    /**
     * Démarre un serveur
     */
    start(uuid: string): Promise<void>;
    /**
     * Arrête un serveur
     */
    stop(uuid: string): Promise<void>;
    /**
     * Redémarre un serveur
     */
    restart(uuid: string): Promise<void>;
    /**
     * Kill un serveur (arrêt forcé)
     */
    kill(uuid: string): Promise<void>;
    /**
     * Définit l'état d'alimentation d'un serveur
     */
    setPowerState(uuid: string, signal: PowerAction['signal']): Promise<void>;
    /**
     * Réinstalle un serveur
     */
    reinstall(uuid: string): Promise<void>;
    /**
     * Supprime définitivement un serveur
     */
    delete(serverId: number, force?: boolean): Promise<void>;
    /**
     * Récupère un serveur par son ID numérique
     */
    fetchById(serverId: number): Promise<Server>;
    /**
     * Récupère l'ID numérique du serveur depuis l'UUID (pour l'API Application)
     */
    private getServerIdFromUuid;
    /**
     * Renomme un serveur
     */
    rename(uuid: string, name: string): Promise<void>;
    /**
     * Change l'image Docker d'un serveur
     */
    setDockerImage(uuid: string, dockerImage: string): Promise<void>;
    /**
     * Liste tous les serveurs via l'API Application (nécessite une clé admin)
     */
    listAll(search?: string): Promise<Server[]>;
}
//# sourceMappingURL=ServerManager.d.ts.map