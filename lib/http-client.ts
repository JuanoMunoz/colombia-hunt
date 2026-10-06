export type HttpClientOptions = {
    headers?: HeadersInit;
    signal?: AbortSignal;
};

export class HttpClientError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly payload: unknown,
    ) {
        super(message);
        this.name = "HttpClientError";
    }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
    method: HttpMethod,
    path: string,
    options: HttpClientOptions,
    body?: unknown,
): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");
    if (body !== undefined) headers.set("Content-Type", "application/json");

    let response: Response;
    try {
        response = await fetch(path, {
            method,
            headers,
            credentials: "same-origin",
            signal: options.signal,
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") throw error;
        throw new HttpClientError("No se pudo conectar con el servidor.", 0, error);
    }

    const payload = response.status === 204
        ? undefined
        : await response.json().catch(() => undefined) as unknown;

    if (!response.ok) {
        const message =
            typeof payload === "object" && payload !== null && "error" in payload &&
                typeof payload.error === "string"
                ? payload.error
                : `La solicitud falló (${response.status}).`;
        throw new HttpClientError(message, response.status, payload);
    }

    return payload as T;
}

export const httpClient = {
    get<T>(path: string, options: HttpClientOptions = {}) {
        return request<T>("GET", path, options);
    },
    post<T, TBody = unknown>(path: string, body: TBody, options: HttpClientOptions = {}) {
        return request<T>("POST", path, options, body);
    },
    put<T, TBody = unknown>(path: string, body: TBody, options: HttpClientOptions = {}) {
        return request<T>("PUT", path, options, body);
    },
    patch<T, TBody = unknown>(path: string, body: TBody, options: HttpClientOptions = {}) {
        return request<T>("PATCH", path, options, body);
    },
    delete<T = void>(path: string, options: HttpClientOptions = {}) {
        return request<T>("DELETE", path, options);
    },
};

export type ApiCity = {
    id: number;
    code: string;
    translations: Partial<Record<"es" | "en", {
        slug: string;
        name: string;
        description: string | null;
    }>>;
};

export type ApiCategory = {
    id: number;
    code: string;
    translations: Partial<Record<"es" | "en", {
        name: string;
        description: string | null;
    }>>;
};

export type ApiProfile = {
    name: string;
    githubUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    whatsapp: string | null;
};

export type CreateProjectInput = {
    title: string;
    description: string;
    cityId: number;
    categoryIds: number[];
    imageUrl: string | null;
    pageUrl: string;
    livecodeUrl: string;
};

export const catalogApi = {
    cities: {
        list(options?: HttpClientOptions) {
            return httpClient.get<ApiCity[]>("/api/cities", options);
        },
    },
    categories: {
        list(options?: HttpClientOptions) {
            return httpClient.get<ApiCategory[]>("/api/categories", options);
        },
    },
};

export const profileApi = {
    get(options?: HttpClientOptions) {
        return httpClient.get<{ profile: ApiProfile }>("/api/profile", options);
    },
    update(changes: Partial<ApiProfile>, options?: HttpClientOptions) {
        return httpClient.patch<{ profile: ApiProfile }, Partial<ApiProfile>>(
            "/api/profile",
            changes,
            options,
        );
    },
};

export const projectApi = {
    create(changes: CreateProjectInput, options?: HttpClientOptions) {
        return httpClient.post<{ projectId: number }, CreateProjectInput>(
            "/api/projects",
            changes,
            options,
        );
    },
};