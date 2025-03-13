import { Customer } from "../store/useCustomerStore";
import { fetchWithAuth } from "./auth.service";
const API_URL_CUSTOMERS = `${import.meta.env.VITE_BASE_URL}/customers`;

// Obtener todos los clientes con paginación y búsqueda
export const getCustomers = async (page: number = 1, limit: number = 10, searchTerm: string = "") => {
    try {
        const url = new URL(API_URL_CUSTOMERS);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());
        if (searchTerm) {
            url.searchParams.append("searchTerm", searchTerm);
        }

        const response = await fetchWithAuth(url.toString(), { method: "GET" });

        if (!response.ok) throw new Error("Error al obtener clientes");

        return await response.json();
    } catch (error) {
        console.error("Error en getCustomers:", error);
        return null;
    }
};

// Crear un nuevo cliente
export const createCustomer = async (customer: Omit<Customer, "id_customer" | "createdAt" | "updatedAt">) => {
    try {
        const response = await fetchWithAuth(API_URL_CUSTOMERS, {
            method: "POST",
            body: JSON.stringify(customer),
        });

        if (!response.ok) throw new Error("Error al crear cliente");

        return await response.json();
    } catch (error) {
        console.error("Error en createCustomer:", error);
        return null;
    }
};

// Actualizar un cliente existente
export const updateCustomer = async (id: number, customer: Partial<Customer>) => {
    try {
        const response = await fetchWithAuth(`${API_URL_CUSTOMERS}/${id}`, {
            method: "PUT",
            body: JSON.stringify(customer),
        });

        if (!response.ok) throw new Error("Error al actualizar cliente");

        return await response.json();
    } catch (error) {
        console.error("Error en updateCustomer:", error);
        return null;
    }
};

// Buscar cliente por DNI
export const searchCustomerByDni = async (dni: string) => {
    try {
        const url = new URL(`${API_URL_CUSTOMERS}/search`);
        url.searchParams.append("dni", dni);

        const response = await fetchWithAuth(url.toString(), { method: "GET" });

        if (!response.ok) throw new Error("Error al buscar cliente por DNI");

        return await response.json();
    } catch (error) {
        console.error("Error en searchCustomerByDni:", error);
        return null;
    }
};
