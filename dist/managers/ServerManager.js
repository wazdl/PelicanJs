"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerManager = void 0;
const Server_1 = require("../structures/Server");
class ServerManager {
    constructor(client, app) {
        this.client = client;
        this.app = app;
    }
    /**
     * Récupère un serveur par son UUID
     */
    async fetch(uuid) {
        const response = await this.client.get(`/servers/${uuid}`);
        return new Server_1.Server(this.client, response.attributes);
    }
    /**
     * Récupère tous les serveurs
     */
    async fetchAll() {
        const response = await this.client.get('/servers');
        return response.data.map(server => new Server_1.Server(this.client, server.attributes));
    }
    /**
     * Récupère les ressources d'un serveur
     */
    async fetchResources(uuid) {
        const response = await this.client.get(`/servers/${uuid}/resources`);
        return response.attributes;
    }
    /**
     * Récupère les allocations réseau d'un serveur
     */
    async fetchAllocations(uuid) {
        const response = await this.client.get(`/servers/${uuid}/network/allocations`);
        return response.data.map(allocation => allocation.attributes);
    }
    /**
     * Démarre un serveur
     */
    async start(uuid) {
        await this.setPowerState(uuid, 'start');
    }
    /**
     * Arrête un serveur
     */
    async stop(uuid) {
        await this.setPowerState(uuid, 'stop');
    }
    /**
     * Redémarre un serveur
     */
    async restart(uuid) {
        await this.setPowerState(uuid, 'restart');
    }
    /**
     * Kill un serveur (arrêt forcé)
     */
    async kill(uuid) {
        await this.setPowerState(uuid, 'kill');
    }
    /**
     * Définit l'état d'alimentation d'un serveur
     */
    async setPowerState(uuid, signal) {
        await this.client.post(`/servers/${uuid}/power`, { signal });
    }
    /**
     * Réinstalle un serveur
     */
    async reinstall(uuid) {
        // Utiliser l'API Application pour la réinstallation (nécessite une clé admin)
        if (this.app) {
            await this.app.post(`/servers/${this.getServerIdFromUuid(uuid)}/reinstall`);
        }
        else {
            // Fallback vers l'API Client si disponible
            await this.client.post(`/servers/${uuid}/settings/reinstall`);
        }
    }
    /**
     * Supprime définitivement un serveur
     */
    async delete(serverId, force = false) {
        if (!this.app) {
            throw new Error('Application API required for server deletion');
        }
        const endpoint = force ? `/servers/${serverId}/force` : `/servers/${serverId}`;
        await this.app.delete(endpoint);
    }
    /**
     * Récupère un serveur par son ID numérique
     */
    async fetchById(serverId) {
        if (!this.app) {
            throw new Error('Application API required for server lookup by ID');
        }
        const response = await this.app.get(`/servers/${serverId}`);
        return new Server_1.Server(this.client, response.attributes);
    }
    /**
     * Récupère l'ID numérique du serveur depuis l'UUID (pour l'API Application)
     */
    async getServerIdFromUuid(uuid) {
        if (!this.app) {
            throw new Error('Application API required for server ID lookup');
        }
        // Récupérer le serveur via l'API Application pour obtenir son ID numérique
        const response = await this.app.get(`/servers?filter[uuid]=${uuid}`);
        if (response.data.length === 0) {
            throw new Error(`Server with UUID ${uuid} not found`);
        }
        return response.data[0].attributes.id;
    }
    /**
     * Renomme un serveur
     */
    async rename(uuid, name) {
        await this.client.put(`/servers/${uuid}/settings/rename`, { name });
    }
    /**
     * Change l'image Docker d'un serveur
     */
    async setDockerImage(uuid, dockerImage) {
        await this.client.put(`/servers/${uuid}/settings/docker-image`, { docker_image: dockerImage });
    }
    /**
     * Liste tous les serveurs via l'API Application (nécessite une clé admin)
     */
    async listAll(search) {
        if (!this.app) {
            throw new Error('Application API required for listing all servers');
        }
        let endpoint = '/servers';
        if (search) {
            endpoint += `?search=${encodeURIComponent(search)}`;
        }
        const response = await this.app.get(endpoint);
        return response.data.map(server => new Server_1.Server(this.client, server.attributes));
    }
}
exports.ServerManager = ServerManager;
//# sourceMappingURL=ServerManager.js.map