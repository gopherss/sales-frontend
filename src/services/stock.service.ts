import { fetchWithAuth } from "./auth.service";
const API_URL_STOCK = `${import.meta.env.VITE_BASE_URL}/stock`;

export interface StockItem {
    id_product: number;
    name: string;
    sku: string | null;
    price: number;
    unit_type: string;
    category: string;
    stock: number;
}

export interface StockPagination {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
    data: StockItem[];
}

// Obtener stock con paginación y búsqueda
export const getStock = async (page: number = 1, limit: number = 10, searchTerm: string = "") => {
    try {
        const url = new URL(API_URL_STOCK);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());
        if (searchTerm) {
            url.searchParams.append("searchTerm", searchTerm);
        }

        const response = await fetchWithAuth(url.toString(), {
            method: "GET",
        });

        if (!response.ok) throw new Error("Error al obtener el stock");

        return await response.json();
    } catch (error) {
        console.error("Error en getStock:", error);
        return null;
    }
};
