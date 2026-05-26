"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const User_1 = require("../structures/User");
class UserManager {
    constructor(app) {
        this.app = app;
    }
    /**
     * Récupère un utilisateur par son ID
     */
    async fetch(id) {
        const response = await this.app.get(`/users/${id}`);
        return new User_1.User(this.app, response.attributes);
    }
    /**
     * Récupère tous les utilisateurs
     */
    async fetchAll() {
        const response = await this.app.get('/users');
        return response.data.map(user => new User_1.User(this.app, user.attributes));
    }
    /**
     * Récupère tous les rôles disponibles
     */
    async fetchRoles() {
        // Utiliser le RoleManager dédié
        const roles = await this.app.roles.fetchAll();
        return roles.map(role => ({
            id: role.id,
            name: role.name,
            created_at: role.createdAt.toISOString(),
            updated_at: role.updatedAt?.toISOString()
        }));
    }
    /**
     * Crée un nouvel utilisateur avec le système de rôles Pelican
     */
    async create(options) {
        // Convertir le rôle string en format attendu par l'API
        let roleData = {};
        if (options.role) {
            // Si un rôle simple est fourni, l'utiliser directement
            roleData = { role: options.role };
        }
        else if (options.roles && options.roles.length > 0) {
            // Si des IDs de rôles sont fournis, les utiliser
            roleData = { roles: options.roles };
        }
        else {
            // Rôle par défaut
            roleData = { role: 'user' };
        }
        const userData = {
            username: options.username,
            email: options.email,
            password: options.password,
            first_name: options.first_name || options.username,
            last_name: options.last_name || '',
            ...roleData
        };
        const response = await this.app.post('/users', userData);
        return new User_1.User(this.app, response.attributes);
    }
    /**
     * Supprime un utilisateur
     */
    async delete(id) {
        await this.app.delete(`/users/${id}`);
    }
    /**
     * Met à jour un utilisateur
     */
    async update(id, options) {
        const response = await this.app.put(`/users/${id}`, options);
        return new User_1.User(this.app, response.attributes);
    }
    /**
     * Assigne un rôle à un utilisateur
     */
    async assignRole(userId, roleId) {
        await this.app.post(`/users/${userId}/roles`, { role: roleId });
    }
    /**
     * Retire un rôle d'un utilisateur
     */
    async removeRole(userId, roleId) {
        await this.app.delete(`/users/${userId}/roles/${roleId}`);
    }
}
exports.UserManager = UserManager;
//# sourceMappingURL=UserManager.js.map