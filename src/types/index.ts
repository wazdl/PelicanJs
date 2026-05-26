export interface PelicanConfig {
  url: string;
  clientKey?: string;
  adminKey?: string;
}

export interface ServerData {
  id: number;
  uuid: string;
  identifier: string;
  name: string;
  description?: string;
  status?: string;
  suspended: boolean;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads?: string;
    oom_disabled: boolean;
  };
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  user: number;
  node: number;
  allocation: number;
  nest: number;
  egg: number;
  container: {
    startup_command: string;
    image: string;
    installed: boolean;
    environment: Record<string, any>;
  };
  created_at: string;
  updated_at: string;
}

// Structure mise à jour pour les rôles Pelican
export interface RoleData {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface UserData {
  id: number;
  external_id?: string;
  uuid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  root_admin: boolean; // Gardé pour compatibilité mais deprecated
  roles: RoleData[]; // Nouveau système de rôles Pelican (array d'objets)
  '2fa': boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserOptions {
  username: string;
  email: string;
  password: string;
  role?: string; // Rôle simple pour compatibilité
  roles?: number[]; // IDs des rôles à assigner (pour usage avancé)
  first_name?: string;
  last_name?: string;
}

export interface ServerResourcesData {
  current_state: string;
  is_suspended: boolean;
  resources: {
    memory_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
    uptime: number;
  };
}

export interface AllocationData {
  id: number;
  ip: string;
  ip_alias?: string;
  port: number;
  notes?: string;
  is_default: boolean;
}

export interface PowerAction {
  signal: 'start' | 'stop' | 'restart' | 'kill';
}

export interface ApiResponse<T> {
  object: string;
  attributes: T;
}

export interface PaginatedResponse<T> {
  object: string;
  data: ApiResponse<T>[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
}

// Constantes pour les rôles Pelican les plus communs
export const CommonRoleNames = {
  ADMIN: 'Administrator',
  USER: 'User',
  MODERATOR: 'Moderator'
} as const;

export type CommonRoleName = typeof CommonRoleNames[keyof typeof CommonRoleNames];