import { PelicanClient } from '../client/PelicanClient';
import { ServerData, ServerResourcesData, AllocationData } from '../types';

export class Server {
  public readonly id: number;
  public readonly uuid: string;
  public readonly identifier: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly status?: string;
  public readonly suspended: boolean;
  public readonly limits: ServerData['limits'];
  public readonly featureLimits: ServerData['feature_limits'];
  public readonly user: number;
  public readonly node: number;
  public readonly allocation: number;
  public readonly nest: number;
  public readonly egg: number;
  public readonly container: ServerData['container'];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(private client: PelicanClient, data: ServerData) {
    this.id = data.id;
    this.uuid = data.uuid;
    this.identifier = data.identifier;
    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.suspended = data.suspended;
    this.limits = data.limits;
    this.featureLimits = data.feature_limits;
    this.user = data.user;
    this.node = data.node;
    this.allocation = data.allocation;
    this.nest = data.nest;
    this.egg = data.egg;
    this.container = data.container;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);
  }

  /**
   * Récupère les ressources du serveur
   */
  async fetchResources(): Promise<ServerResourcesData> {
    return this.client.servers.fetchResources(this.uuid);
  }

  /**
   * Récupère les allocations réseau du serveur
   */
  async fetchAllocations(): Promise<AllocationData[]> {
    return this.client.servers.fetchAllocations(this.uuid);
  }

  /**
   * Démarre le serveur
   */
  async start(): Promise<void> {
    return this.client.servers.start(this.uuid);
  }

  /**
   * Arrête le serveur
   */
  async stop(): Promise<void> {
    return this.client.servers.stop(this.uuid);
  }

  /**
   * Redémarre le serveur
   */
  async restart(): Promise<void> {
    return this.client.servers.restart(this.uuid);
  }

  /**
   * Kill le serveur (arrêt forcé)
   */
  async kill(): Promise<void> {
    return this.client.servers.kill(this.uuid);
  }

  /**
   * Réinstalle le serveur
   */
  async reinstall(): Promise<void> {
    // Utiliser l'ID numérique pour l'API Application Pelican
    return this.client.servers.reinstall(this.uuid);
  }

  /**
   * Supprime définitivement le serveur
   */
  async delete(force: boolean = false): Promise<void> {
    // Nécessite l'API Application avec l'ID numérique
    return this.client.servers.delete(this.id, force);
  }
  /**
   * Renomme le serveur
   */
  async rename(name: string): Promise<void> {
    return this.client.servers.rename(this.uuid, name);
  }

  /**
   * Change l'image Docker du serveur
   */
  async setDockerImage(dockerImage: string): Promise<void> {
    return this.client.servers.setDockerImage(this.uuid, dockerImage);
  }

  /**
   * Obtient l'IP et le port principal du serveur
   */
  async getConnectionInfo(): Promise<{ ip: string; port: number }> {
    const allocations = await this.fetchAllocations();
    const primaryAllocation = allocations.find(alloc => alloc.is_default) || allocations[0];
    
    if (!primaryAllocation) {
      throw new Error('Aucune allocation trouvée pour ce serveur');
    }

    return {
      ip: primaryAllocation.ip_alias || primaryAllocation.ip,
      port: primaryAllocation.port
    };
  }
}