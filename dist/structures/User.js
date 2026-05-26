"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(app, data) {
        this.app = app;
        this.id = data.id;
        this.externalId = data.external_id;
        this.uuid = data.uuid;
        this.username = data.username;
        this.email = data.email;
        this.firstName = data.first_name;
        this.lastName = data.last_name;
        this.language = data.language;
        this.rootAdmin = data.root_admin; // Deprecated
        this.role = this.extractPrimaryRole(data); // Nouveau système simple
        this.roles = data.roles || []; // Nouveau système
        this.twoFactorEnabled = data['2fa'];
        this.createdAt = new Date(data.created_at);
        this.updatedAt = new Date(data.updated_at);
    }
    /**
     * Extrait le rôle principal depuis les données
     */
    extractPrimaryRole(data) {
        // Si l'API retourne un rôle simple
        if (data.role) {
            return data.role;
        }
        // Si on a des rôles multiples, prendre le premier
        if (data.roles && data.roles.length > 0) {
            return data.roles[0].name.toLowerCase();
        }
        // Fallback basé sur root_admin
        return data.root_admin ? 'admin' : 'user';
    }
    /**
     * Supprime cet utilisateur
     */
    async delete() {
        return this.app.users.delete(this.id);
    }
    /**
     * Met à jour cet utilisateur
     */
    async update(options) {
        return this.app.users.update(this.id, options);
    }
    /**
     * Obtient le nom complet de l'utilisateur
     */
    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }
    /**
     * Vérifie si l'utilisateur a un rôle spécifique par nom
     */
    hasRole(roleName) {
        // Vérifier le rôle principal
        if (this.role === roleName.toLowerCase()) {
            return true;
        }
        // Vérifier dans les rôles multiples
        return this.roles.some(role => role.name === roleName);
    }
    /**
     * Vérifie si l'utilisateur a un rôle spécifique par ID
     */
    hasRoleId(roleId) {
        return this.roles.some(role => role.id === roleId);
    }
    /**
     * Vérifie si l'utilisateur est administrateur
     */
    get isAdmin() {
        return this.rootAdmin ||
            this.role === 'admin' ||
            this.hasRole('Administrator') ||
            this.hasRole('Admin');
    }
    /**
     * Vérifie si l'utilisateur est modérateur
     */
    get isModerator() {
        return this.role === 'moderator' ||
            this.hasRole('Moderator') ||
            this.hasRole('Modérateur');
    }
    /**
     * Obtient la liste des noms de rôles
     */
    get roleNames() {
        return this.roles.map(role => role.name);
    }
    /**
     * Obtient le rôle principal (premier rôle ou le plus important)
     */
    get primaryRole() {
        if (this.roles.length === 0)
            return null;
        // Prioriser les rôles admin
        const adminRole = this.roles.find(role => role.name.toLowerCase().includes('admin') ||
            role.name.toLowerCase().includes('administrator'));
        if (adminRole)
            return adminRole;
        // Puis les modérateurs
        const modRole = this.roles.find(role => role.name.toLowerCase().includes('mod') ||
            role.name.toLowerCase().includes('moderator'));
        if (modRole)
            return modRole;
        // Sinon le premier rôle
        return this.roles[0];
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map