const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
    token?: string;
}

async function fetchAPI<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    if (options.token) {
        headers['Authorization'] = `Bearer ${options.token}`;
    }

    const config = {
        ...options,
        headers,
    };

    console.log(`[API] ${config.method || 'GET'} ${endpoint}`, options.body ? JSON.parse(options.body as string) : '');

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export const getFullUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;

    // Remove trailing slash from server root if exists
    const serverRoot = API_URL.replace(/\/api\/?$/, '');

    // Ensure url has leading slash
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;

    return `${serverRoot}${cleanUrl}`;
};

export const api = {
    // Auth
    login: (data: any) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

    // Listings
    getListings: (query?: any) => {
        const queryString = query ? '?' + new URLSearchParams(query).toString() : '';
        return fetchAPI(`/listings${queryString}`);
    },
    getListing: (id: string) => fetchAPI(`/listings/${id}`),
    createListing: (data: any, token: string) => fetchAPI('/listings', { method: 'POST', body: JSON.stringify(data), token }),
    updateListing: (id: string, data: any, token: string) => fetchAPI(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
    deleteListing: (id: string, token: string) => fetchAPI(`/listings/${id}`, { method: 'DELETE', token }),
    uploadFile: async (file: File, folder: string = 'misc') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Upload failed');
        return response.json();
    },

    // Enquiries
    createEnquiry: (data: any) => fetchAPI('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
    getEnquiries: (token: string) => fetchAPI('/enquiries', { token }),
    updateEnquiryStatus: (id: string, status: string, token: string) => fetchAPI(`/enquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), token }),

    // Floor Plans
    getFloorPlans: (query?: any) => {
        const queryString = query ? '?' + new URLSearchParams(query).toString() : '';
        return fetchAPI(`/floorplans${queryString}`);
    },
    getFloorPlan: (id: string) => fetchAPI(`/floorplans/${id}`),
    createFloorPlan: (data: any, token: string) => fetchAPI('/floorplans', { method: 'POST', body: JSON.stringify(data), token }),
    updateFloorPlan: (id: string, data: any, token: string) => fetchAPI(`/floorplans/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
    deleteFloorPlan: (id: string, token: string) => fetchAPI(`/floorplans/${id}`, { method: 'DELETE', token }),

    // Facades
    getFacades: (query?: any) => {
        const queryString = query ? '?' + new URLSearchParams(query).toString() : '';
        return fetchAPI(`/facades${queryString}`);
    },
    getFacade: (id: string) => fetchAPI(`/facades/${id}`),
    createFacade: (data: any, token: string) => fetchAPI('/facades', { method: 'POST', body: JSON.stringify(data), token }),
    updateFacade: (id: string, data: any, token: string) => fetchAPI(`/facades/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
    deleteFacade: (id: string, token: string) => fetchAPI(`/facades/${id}`, { method: 'DELETE', token }),

    // Service Areas
    getServiceAreas: () => fetchAPI('/service-areas'),
    getServiceArea: (id: string) => fetchAPI(`/service-areas/${id}`),
    createServiceArea: (data: any, token: string) => fetchAPI('/service-areas', { method: 'POST', body: JSON.stringify(data), token }),
    updateServiceArea: (id: string, data: any, token: string) => fetchAPI(`/service-areas/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
    deleteServiceArea: (id: string, token: string) => fetchAPI(`/service-areas/${id}`, { method: 'DELETE', token }),

    // Floor Plan Filters
    getFloorPlanFilters: () => fetchAPI('/floorplans/filters'),

    // Upgrades
    getUpgradeGroups: (query?: any) => {
        const queryString = query ? '?' + new URLSearchParams(query).toString() : '';
        return fetchAPI(`/upgrades/groups${queryString}`);
    },
    createUpgradeGroup: (data: any, token: string) => fetchAPI('/upgrades/groups', { method: 'POST', body: JSON.stringify(data), token }),
    updateUpgradeGroup: (id: string, data: any, token: string) => fetchAPI(`/upgrades/groups/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
    deleteUpgradeGroup: (id: string, token: string) => fetchAPI(`/upgrades/groups/${id}`, { method: 'DELETE', token }),

    getUpgradeCategories: (query?: any) => {
        const queryString = query ? '?' + new URLSearchParams(query).toString() : '';
        return fetchAPI(`/upgrades/categories${queryString}`);
    },
    createUpgradeCategory: (data: any, token: string) => fetchAPI('/upgrades/categories', { method: 'POST', body: JSON.stringify(data), token }),
    updateUpgradeCategory: (id: string, data: any, token: string) => fetchAPI(`/upgrades/categories/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
    deleteUpgradeCategory: (id: string, token: string) => fetchAPI(`/upgrades/categories/${id}`, { method: 'DELETE', token }),

    createUpgrade: (data: any, token: string) => fetchAPI('/upgrades/upgrades', { method: 'POST', body: JSON.stringify(data), token }),
    updateUpgrade: (id: string, data: any, token: string) => fetchAPI(`/upgrades/upgrades/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
    deleteUpgrade: (id: string, token: string) => fetchAPI(`/upgrades/upgrades/${id}`, { method: 'DELETE', token }),
};
