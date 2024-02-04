export interface ApiConfig {
    baseUrl: string;
    noAuthHeaders: HeadersInit;
    authHeaders: () => HeadersInit;
}
