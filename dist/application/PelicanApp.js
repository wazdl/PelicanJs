"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PelicanApp = void 0;
const axios_1 = __importDefault(require("axios"));
const UserManager_1 = require("../managers/UserManager");
const RoleManager_1 = require("../managers/RoleManager");
const ServerManager_1 = require("../managers/ServerManager");
class PelicanApp {
    constructor(config) {
        if (!config.url) {
            throw new Error('Pelican Panel URL Required');
        }
        if (!config.adminKey) {
            throw new Error('Admin API key required');
        }
        this.url = this.normalizeUrl(config.url);
        this.adminKey = config.adminKey;
        this.http = axios_1.default.create({
            baseURL: `${this.url}/api/application`,
            headers: {
                'Authorization': `Bearer ${this.adminKey}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        this.users = new UserManager_1.UserManager(this);
        this.roles = new RoleManager_1.RoleManager(this);
        this.servers = new ServerManager_1.ServerManager(null, this);
    }
    normalizeUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url;
        }
        return url.replace(/\/$/, '');
    }
    async request(method, endpoint, data) {
        try {
            const response = await this.http.request({
                method,
                url: endpoint,
                data
            });
            return response.data;
        }
        catch (error) {
            // Gestion améliorée des erreurs Pelican
            let errorMessage = error.message;
            if (error.response) {
                const status = error.response.status;
                const responseData = error.response.data;
                if (status === 401) {
                    errorMessage = 'This action is unauthorized - Vérifiez votre clé API admin';
                }
                else if (status === 404) {
                    errorMessage = 'The requested resource could not be found on the server';
                }
                else if (status === 409) {
                    errorMessage = 'Conflict - Le serveur est peut-être en cours d\'exécution (utilisez force:true)';
                }
                else if (status === 422) {
                    errorMessage = 'Validation error - Vérifiez les paramètres de la requête';
                }
                else if (responseData?.errors?.[0]?.detail) {
                    errorMessage = responseData.errors[0].detail;
                }
                else if (responseData?.message) {
                    errorMessage = responseData.message;
                }
            }
            throw new Error(`Pelican API Error: ${errorMessage}`);
        }
    }
    get(endpoint) {
        return this.request('GET', endpoint);
    }
    post(endpoint, data) {
        return this.request('POST', endpoint, data);
    }
    put(endpoint, data) {
        return this.request('PUT', endpoint, data);
    }
    delete(endpoint) {
        return this.request('DELETE', endpoint);
    }
}
exports.PelicanApp = PelicanApp;
//# sourceMappingURL=PelicanApp.js.map