/**
 * Cliente API para EPROLO Dropshipping
 * Implementa búsqueda, detalles y creación de órdenes.
 */

const EPROLO_API_BASE = 'https://api.eprolo.com/api/v1';
const EPROLO_API_KEY = process.env.EPROLO_API_KEY;

export interface EproloProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    variants?: Array<{
        id: string;
        name: string;
        price: number;
    }>;
}

export interface EproloSearchResponse {
    products: EproloProduct[];
    total: number;
    page: number;
    totalPages: number;
}

class EproloClient {
    private async request(endpoint: string, options: RequestInit = {}) {
        if (!EPROLO_API_KEY) {
            throw new Error('EPROLO_API_KEY no está configurada');
        }

        const url = `${EPROLO_API_BASE}${endpoint}`;
        const headers = {
            'Authorization': `Bearer ${EPROLO_API_KEY}`,
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });

            if (response.status === 429) {
                throw new Error('Rate limit excedido en EPROLO (máx 100/min)');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error en la API de EPROLO: ${response.status}`);
            }

            return await response.json();
        } catch (error: any) {
            console.error(`[EPROLO_ERROR] ${endpoint}:`, error.message);
            throw error;
        }
    }

    /**
     * Busca productos por palabra clave
     */
    async searchProducts(query: string = '', page: number = 1, limit: number = 20): Promise<EproloSearchResponse> {
        const params = new URLSearchParams({
            search: query,
            page: page.toString(),
            limit: limit.toString(),
        });

        // Nota: Aunque el prompt sugiere GET, verificamos el endpoint de búsqueda
        const data = await this.request(`/products/search?${params.toString()}`);

        // Transformación para mantener compatibilidad con la interfaz de PlanMARE
        return {
            products: data.products?.map((p: any) => ({
                id: p.id.toString(),
                name: p.name,
                price: parseFloat(p.price),
                image: p.image || p.main_image,
                description: p.description || '',
                variants: p.variants?.map((v: any) => ({
                    id: v.id.toString(),
                    name: v.name,
                    price: parseFloat(v.price)
                }))
            })) || [],
            total: data.total || 0,
            page: data.page || page,
            totalPages: data.total_pages || 1
        };
    }

    /**
     * Obtiene detalles de un producto específico
     */
    async getProductDetails(id: string): Promise<EproloProduct> {
        const data = await this.request(`/products/${id}`);

        return {
            id: data.id.toString(),
            name: data.name,
            price: parseFloat(data.price),
            image: data.image || data.main_image,
            description: data.description || '',
            variants: data.variants?.map((v: any) => ({
                id: v.id.toString(),
                name: v.name,
                price: parseFloat(v.price)
            }))
        };
    }

    /**
     * Crea una orden en EPROLO
     */
    async createOrder(orderData: any) {
        return await this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }
}

export const eprolo = new EproloClient();
