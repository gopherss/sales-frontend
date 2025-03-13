import { fetchWithAuth } from "./auth.service";
import { Supplier } from '../store/useSupplierStore';
const API_URL_SUPPLIERS = `${import.meta.env.VITE_BASE_URL}/suppliers`;
// Obtener todos los proveedores con paginación y búsqueda
export const getSuppliers = async (page: number = 1, limit: number = 10, searchTerm: string = "") => {
    try {
        const url = new URL(API_URL_SUPPLIERS);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());
        if (searchTerm) {
            url.searchParams.append("searchTerm", searchTerm);
        }

        const response = await fetchWithAuth(url.toString(), {
            method: "GET",
        });

        if (!response.ok) throw new Error("Error al obtener proveedores");

        return await response.json();
    } catch (error) {
        console.error("Error en getSuppliers:", error);
        return null;
    }
};

// Crear un nuevo proveedor
export const createSupplier = async (supplier: Omit<Supplier, "id_supplier" | "createdAt" | "updatedAt">) => {
    try {
        const response = await fetchWithAuth(API_URL_SUPPLIERS, {
            method: "POST",
            body: JSON.stringify(supplier),
        });

        if (!response.ok) throw new Error("Error al crear proveedor");

        return await response.json();
    } catch (error) {
        console.error("Error en createSupplier:", error);
        return null;
    }
};

// Actualizar un proveedor existente
export const updateSupplier = async (id: number, supplier: Partial<Supplier>) => {
    try {
        const response = await fetchWithAuth(`${API_URL_SUPPLIERS}/${id}`, {
            method: "PUT",
            body: JSON.stringify(supplier),
        });

        if (!response.ok) throw new Error("Error al actualizar proveedor");

        return await response.json();
    } catch (error) {
        console.error("Error en updateSupplier:", error);
        return null;
    }
};