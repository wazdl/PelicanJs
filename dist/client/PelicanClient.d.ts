import { ServerManager } from '../managers/ServerManager';
import { PelicanConfig } from '../types';
export declare class PelicanClient {
    readonly url: string;
    readonly clientKey: string;
    private readonly http;
    readonly servers: ServerManager;
    constructor(config: PelicanConfig);
    private normalizeUrl;
    request<T>(method: string, endpoint: string, data?: any): Promise<T>;
    get<T>(endpoint: string): Promise<T>;
    post<T>(endpoint: string, data?: any): Promise<T>;
    put<T>(endpoint: string, data?: any): Promise<T>;
    delete<T>(endpoint: string): Promise<T>;
}
//# sourceMappingURL=PelicanClient.d.ts.map