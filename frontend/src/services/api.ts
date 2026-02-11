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
    const serverRoot = API_URL.replace('/api', '');
    return `${serverRoot}${url}`;
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
};
