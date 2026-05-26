"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
class Server {
    constructor(client, data) {
        this.client = client;
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
    async fetchResources() {
        return this.client.servers.fetchResources(this.uuid);
    }
    /**
     * Récupère les allocations réseau du serveur
     */
    async fetchAllocations() {
        return this.client.servers.fetchAllocations(this.uuid);
    }
    /**
     * Démarre le serveur
     */
    async start() {
        return this.client.servers.start(this.uuid);
    }
    /**
     * Arrête le serveur
     */
    async stop() {
        return this.client.servers.stop(this.uuid);
    }
    /**
     * Redémarre le serveur
     */
    async restart() {
        return this.client.servers.restart(this.uuid);
    }
    /**
     * Kill le serveur (arrêt forcé)
     */
    async kill() {
        return this.client.servers.kill(this.uuid);
    }
    /**
     * Réinstalle le serveur
     */
    async reinstall() {
        // Utiliser l'ID numérique pour l'API Application Pelican
        return this.client.servers.reinstall(this.uuid);
    }
    /**
     * Supprime définitivement le serveur
     */
    async delete(force = false) {
        // Nécessite l'API Application avec l'ID numérique
        return this.client.servers.delete(this.id, force);
    }
    /**
     * Renomme le serveur
     */
    async rename(name) {
        return this.client.servers.rename(this.uuid, name);
    }
    /**
     * Change l'image Docker du serveur
     */
    async setDockerImage(dockerImage) {
        return this.client.servers.setDockerImage(this.uuid, dockerImage);
    }
    /**
     * Obtient l'IP et le port principal du serveur
     */
    async getConnectionInfo() {
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
exports.Server = Server;
//# sourceMappingURL=Server.js.map