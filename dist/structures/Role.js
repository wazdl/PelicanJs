"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
class Role {
    constructor(app, data) {
        this.app = app;
        this.id = data.id;
        this.name = data.name;
        this.createdAt = new Date(data.created_at);
        this.updatedAt = new Date(data.updated_at);
    }
    /**
     * Supprime ce rôle
     */
    async delete() {
        return this.app.roles.delete(this.id);
    }
    /**
     * Met à jour ce rôle
     */
    async update(options) {
        return this.app.roles.update(this.id, options);
    }
    /**
     * Vérifie si c'est un rôle administrateur
     */
    get isAdmin() {
        return this.name.toLowerCase().includes('admin');
    }
    /**
     * Vérifie si c'est un rôle modérateur
     */
    get isModerator() {
        return this.name.toLowerCase().includes('mod');
    }
}
exports.Role = Role;
//# sourceMappingURL=Role.js.map