import { PelicanClient } from '../client/PelicanClient';
import { Server } from '../structures/Server';
import { ServerData, ServerResourcesData, AllocationData, PowerAction, ApiResponse, PaginatedResponse } from '../types';
import { PelicanApp } from '../application/PelicanApp';

export class ServerManager {
  constructor(private client: PelicanClient, private app?: PelicanApp) {}

  /**
   * Récupère un serveur par son UUID
   */
  async fetch(uuid: string): Promise<Server> {
    const response = await this.client.get<ApiResponse<ServerData>>(`/servers/${uuid}`);
    return new Server(this.client, response.attributes);
  }

  /**
   * Récupère tous les serveurs
   */
  async fetchAll(): Promise<Server[]> {
    const response = await this.client.get<PaginatedResponse<ServerData>>('/servers');
    return response.data.map(server => new Server(this.client, server.attributes));
  }

  /**
   * Récupère les ressources d'un serveur
   */
  async fetchResources(uuid: string): Promise<ServerResourcesData> {
    const response = await this.client.get<ApiResponse<ServerResourcesData>>(`/servers/${uuid}/resources`);
    return response.attributes;
  }

  /**
   * Récupère les allocations réseau d'un serveur
   */
  async fetchAllocations(uuid: string): Promise<AllocationData[]> {
    const response = await this.client.get<PaginatedResponse<AllocationData>>(`/servers/${uuid}/network/allocations`);
    return response.data.map(allocation => allocation.attributes);
  }

  /**
   * Démarre un serveur
   */
  async start(uuid: string): Promise<void> {
    await this.setPowerState(uuid, 'start');
  }

  /**
   * Arrête un serveur
   */
  async stop(uuid: string): Promise<void> {
    await this.setPowerState(uuid, 'stop');
  }

  /**
   * Redémarre un serveur
   */
  async restart(uuid: string): Promise<void> {
    await this.setPowerState(uuid, 'restart');
  }

  /**
   * Kill un serveur (arrêt forcé)
   */
  async kill(uuid: string): Promise<void> {
    await this.setPowerState(uuid, 'kill');
  }

  /**
   * Définit l'état d'alimentation d'un serveur
   */
  async setPowerState(uuid: string, signal: PowerAction['signal']): Promise<void> {
    await this.client.post(`/servers/${uuid}/power`, { signal });
  }

  /**
   * Réinstalle un serveur
   */
  async reinstall(uuid: string): Promise<void> {
    // Utiliser l'API Application pour la réinstallation (nécessite une clé admin)
    if (this.app) {
      await this.app.post(`/servers/${this.getServerIdFromUuid(uuid)}/reinstall`);
    } else {
      // Fallback vers l'API Client si disponible
      await this.client.post(`/servers/${uuid}/settings/reinstall`);
    }
  }

  /**
   * Supprime définitivement un serveur
   */
  async delete(serverId: number, force: boolean = false): Promise<void> {
    if (!this.app) {
      throw new Error('Application API required for server deletion');
    }
    
    const endpoint = force ? `/servers/${serverId}/force` : `/servers/${serverId}`;
    await this.app.delete(endpoint);
  }

  /**
   * Récupère un serveur par son ID numérique
   */
  async fetchById(serverId: number): Promise<Server> {
    if (!this.app) {
      throw new Error('Application API required for server lookup by ID');
    }
    
    const response = await this.app.get<ApiResponse<ServerData>>(`/servers/${serverId}`);
    return new Server(this.client, response.attributes);
  }
  /**
   * Récupère l'ID numérique du serveur depuis l'UUID (pour l'API Application)
   */
  private async getServerIdFromUuid(uuid: string): Promise<number> {
    if (!this.app) {
      throw new Error('Application API required for server ID lookup');
    }
    
    // Récupérer le serveur via l'API Application pour obtenir son ID numérique
    const response = await this.app.get<PaginatedResponse<ServerData>>(`/servers?filter[uuid]=${uuid}`);
    if (response.data.length === 0) {
      throw new Error(`Server with UUID ${uuid} not found`);
    }
    
    return response.data[0].attributes.id;
  }

  /**
   * Renomme un serveur
   */
  async rename(uuid: string, name: string): Promise<void> {
    await this.client.put(`/servers/${uuid}/settings/rename`, { name });
  }

  /**
   * Change l'image Docker d'un serveur
   */
  async setDockerImage(uuid: string, dockerImage: string): Promise<void> {
    await this.client.put(`/servers/${uuid}/settings/docker-image`, { docker_image: dockerImage });
  }

  /**
   * Liste tous les serveurs via l'API Application (nécessite une clé admin)
   */
  async listAll(search?: string): Promise<Server[]> {
    if (!this.app) {
      throw new Error('Application API required for listing all servers');
    }

    let endpoint = '/servers';
    if (search) {
      endpoint += `?search=${encodeURIComponent(search)}`;
    }

    const response = await this.app.get<PaginatedResponse<ServerData>>(endpoint);
    return response.data.map(server => new Server(this.client, server.attributes));
  }
}