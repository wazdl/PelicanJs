import axios, { AxiosInstance } from 'axios';
import { UserManager } from '../managers/UserManager';
import { RoleManager } from '../managers/RoleManager';
import { ServerManager } from '../managers/ServerManager';
import { PelicanConfig } from '../types';

export class PelicanApp {
  public readonly url: string;
  public readonly adminKey: string;
  private readonly http: AxiosInstance;
  public readonly users: UserManager;
  public readonly roles: RoleManager;
  public readonly servers: ServerManager;

  constructor(config: PelicanConfig) {
    if (!config.url) {
      throw new Error('Pelican Panel URL Required');
    }
    if (!config.adminKey) {
      throw new Error('Admin API key required');
    }

    this.url = this.normalizeUrl(config.url);
    this.adminKey = config.adminKey;

    this.http = axios.create({
      baseURL: `${this.url}/api/application`,
      headers: {
        'Authorization': `Bearer ${this.adminKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    this.users = new UserManager(this);
    this.roles = new RoleManager(this);
    this.servers = new ServerManager(null as any, this);
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    return url.replace(/\/$/, '');
  }

  public async request<T>(method: string, endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.http.request({
        method,
        url: endpoint,
        data
      });
      return response.data;
    } catch (error: any) {
      // Gestion améliorée des erreurs Pelican
      let errorMessage = error.message;
      
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        
        if (status === 401) {
          errorMessage = 'This action is unauthorized - Vérifiez votre clé API admin';
        } else if (status === 404) {
          errorMessage = 'The requested resource could not be found on the server';
        } else if (status === 409) {
          errorMessage = 'Conflict - Le serveur est peut-être en cours d\'exécution (utilisez force:true)';
        } else if (status === 422) {
          errorMessage = 'Validation error - Vérifiez les paramètres de la requête';
        } else if (responseData?.errors?.[0]?.detail) {
          errorMessage = responseData.errors[0].detail;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        }
      }
      
      throw new Error(`Pelican API Error: ${errorMessage}`);
    }
  }

  public get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  public post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  public put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }
}