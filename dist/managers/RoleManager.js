"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleManager = void 0;
const Role_1 = require("../structures/Role");
class RoleManager {
    constructor(app) {
        this.app = app;
    }
    /**
     * Récupère un rôle par son ID
     */
    async fetch(id) {
        const response = await this.app.get(`/roles/${id}`);
        return new Role_1.Role(this.app, response.attributes);
    }
    /**
     * Récupère tous les rôles via l'endpoint /roles
     */
    async fetchAll() {
        try {
            console.log('🔍 Récupération des rôles via l\'endpoint /roles...');
            // Utiliser l'endpoint direct /roles qui liste tous les rôles
            const response = await this.app.get('/roles');
            console.log('📊 Réponse de l\'API:', response);
            // Vérifier le format de la réponse
            if (response.data && Array.isArray(response.data)) {
                // Format paginé standard
                console.log(`✅ ${response.data.length} rôle(s) trouvé(s) (format paginé)`);
                return response.data.map((roleItem) => {
                    const roleData = roleItem.attributes || roleItem;
                    return new Role_1.Role(this.app, roleData);
                });
            }
            else if (Array.isArray(response)) {
                // Format array direct
                console.log(`✅ ${response.length} rôle(s) trouvé(s) (format array)`);
                return response.map((roleData) => new Role_1.Role(this.app, roleData));
            }
            else if (response.object === 'list' && response.data) {
                // Format Pelican standard avec object: "list"
                console.log(`✅ ${response.data.length} rôle(s) trouvé(s) (format Pelican)`);
                return response.data.map((roleItem) => {
                    const roleData = roleItem.attributes || roleItem;
                    return new Role_1.Role(this.app, roleData);
                });
            }
            else {
                console.warn('⚠️ Format de réponse inattendu:', response);
                // Fallback: essayer de traiter la réponse comme un objet unique
                if (response.id && response.name) {
                    return [new Role_1.Role(this.app, response)];
                }
                throw new Error('Format de réponse inattendu pour l\'endpoint /roles');
            }
        }
        catch (error) {
            console.error('❌ Erreur lors de la récupération des rôles:', error.message);
            // Si l'endpoint direct ne fonctionne pas, utiliser la méthode de fallback
            if (error.message.includes('404') || error.message.includes('not found')) {
                console.log('🔄 Endpoint /roles non disponible, utilisation de la méthode par ID...');
                return this.fetchAllByIds();
            }
            throw error;
        }
    }
    /**
     * Méthode de fallback : récupère tous les rôles en testant les IDs de 1 à 100
     * Utilisée si l'endpoint /roles n'est pas disponible
     */
    async fetchAllByIds() {
        const roles = [];
        // Tester les IDs de 1 à 100 pour trouver tous les rôles existants
        // Arrêter après 10 échecs consécutifs pour optimiser
        let consecutiveFailures = 0;
        const maxConsecutiveFailures = 10;
        console.log('🔍 Recherche des rôles Pelican par ID (méthode de fallback)...');
        for (let id = 1; id <= 100; id++) {
            try {
                const role = await this.fetch(id);
                roles.push(role);
                consecutiveFailures = 0; // Reset le compteur si on trouve un rôle
                console.log(`✅ Rôle trouvé: ${role.name} (ID: ${id})`);
            }
            catch (error) {
                consecutiveFailures++;
                // Ignorer silencieusement les erreurs 404 (rôle n'existe pas)
                if (error instanceof Error) {
                    if (error.message.includes('404') ||
                        error.message.includes('not found') ||
                        error.message.includes('could not be found')) {
                        // C'est normal, le rôle n'existe pas
                        continue;
                    }
                    else if (error.message.includes('401') ||
                        error.message.includes('unauthorized')) {
                        // Problème d'authentification, arrêter
                        console.error(`❌ Erreur d'authentification lors de la récupération du rôle ${id}:`, error.message);
                        break;
                    }
                    else {
                        // Log seulement les erreurs inattendues
                        console.warn(`⚠️ Erreur inattendue lors de la récupération du rôle ${id}:`, error.message);
                    }
                }
                // Si on a trop d'échecs consécutifs après avoir trouvé au moins un rôle, on s'arrête
                if (consecutiveFailures >= maxConsecutiveFailures && roles.length > 0) {
                    console.log(`🛑 Arrêt du scan après ${maxConsecutiveFailures} échecs consécutifs (${roles.length} rôles trouvés)`);
                    break;
                }
                continue;
            }
        }
        console.log(`📊 Scan par ID terminé: ${roles.length} rôle(s) trouvé(s)`);
        return roles;
    }
    /**
     * Crée un nouveau rôle
     */
    async create(options) {
        const roleData = {
            name: options.name
        };
        const response = await this.app.post('/roles', roleData);
        return new Role_1.Role(this.app, response.attributes);
    }
    /**
     * Supprime un rôle
     */
    async delete(id) {
        await this.app.delete(`/roles/${id}`);
    }
    /**
     * Met à jour un rôle
     */
    async update(id, options) {
        const response = await this.app.put(`/roles/${id}`, options);
        return new Role_1.Role(this.app, response.attributes);
    }
}
exports.RoleManager = RoleManager;
//# sourceMappingURL=RoleManager.js.map