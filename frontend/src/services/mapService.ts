export interface GeocodeResult {
    lat: number;
    lon: number;
    display_name: string;
}

export const mapService = {
    /**
     * Geocodes an address string to coordinates using Nominatim (OpenStreetMap).
     * This can be swapped for Google Geocoding API later.
     */
    geocode: async (address: string): Promise<GeocodeResult | null> => {
        if (!address || address.length < 5) return null;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
                {
                    headers: {
                        'Accept-Language': 'en-US,en;q=0.5',
                        'User-Agent': 'MitrahomesApp/1.0' // Recommended by Nominatim policy
                    }
                }
            );

            const data = await response.json();

            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                    display_name: data[0].display_name
                };
            }
        } catch (error) {
            console.error("Geocoding failed:", error);
        }

        return null;
    }
};
