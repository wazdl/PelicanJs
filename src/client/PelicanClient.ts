import axios, { AxiosInstance } from 'axios';
import { ServerManager } from '../managers/ServerManager';
import { PelicanConfig } from '../types';

export class PelicanClient {
  public readonly url: string;
  public readonly clientKey: string;
  private readonly http: AxiosInstance;
  public readonly servers: ServerManager;

  constructor(config: PelicanConfig) {
    if (!config.url) {
      throw new Error('Pelican Panel URL Required');
    }
    if (!config.clientKey) {
      throw new Error('Client API key required');
    }

    this.url = this.normalizeUrl(config.url);
    this.clientKey = config.clientKey;

    this.http = axios.create({
      baseURL: `${this.url}/api/client`,
      headers: {
        'Authorization': `Bearer ${this.clientKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    this.servers = new ServerManager(this);
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
      const errorMessage = error.response?.data?.errors?.[0]?.detail || error.message;
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