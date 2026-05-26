"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PelicanClient = void 0;
const axios_1 = __importDefault(require("axios"));
const ServerManager_1 = require("../managers/ServerManager");
class PelicanClient {
    constructor(config) {
        if (!config.url) {
            throw new Error('Pelican Panel URL Required');
        }
        if (!config.clientKey) {
            throw new Error('Client API key required');
        }
        this.url = this.normalizeUrl(config.url);
        this.clientKey = config.clientKey;
        this.http = axios_1.default.create({
            baseURL: `${this.url}/api/client`,
            headers: {
                'Authorization': `Bearer ${this.clientKey}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        this.servers = new ServerManager_1.ServerManager(this);
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
            const errorMessage = error.response?.data?.errors?.[0]?.detail || error.message;
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
exports.PelicanClient = PelicanClient;
//# sourceMappingURL=PelicanClient.js.map