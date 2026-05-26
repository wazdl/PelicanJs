import { UserManager } from '../managers/UserManager';
import { RoleManager } from '../managers/RoleManager';
import { ServerManager } from '../managers/ServerManager';
import { PelicanConfig } from '../types';
export declare class PelicanApp {
    readonly url: string;
    readonly adminKey: string;
    private readonly http;
    readonly users: UserManager;
    readonly roles: RoleManager;
    readonly servers: ServerManager;
    constructor(config: PelicanConfig);
    private normalizeUrl;
    request<T>(method: string, endpoint: string, data?: any): Promise<T>;
    get<T>(endpoint: string): Promise<T>;
    post<T>(endpoint: string, data?: any): Promise<T>;
    put<T>(endpoint: string, data?: any): Promise<T>;
    delete<T>(endpoint: string): Promise<T>;
}
//# sourceMappingURL=PelicanApp.d.ts.map