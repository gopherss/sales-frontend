import { fetchWithAuth } from "./auth.service";
const API_URL_DASHBOARD = `${import.meta.env.VITE_BASE_URL}/dashboard`;

export const getSalesSummary = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/sales-summary`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error obteniendo el resumen de ventas");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getSalesSummary:", error);
        throw error;
    }
};

export const getPaymentMethods = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/payment-methods`, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error("Error obteniendo los métodos de pago");
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getPaymentMethods:", error);
        throw error;
    }
};

export const getTopProducts = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/top-products`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error obteniendo los productos más vendidos");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getTopProducts:", error);
        throw error;
    }
};

export const getTopUsers = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/top-users`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error obteniendo los usuarios con más ventas");
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getTopUsers:", error);
        throw error;
    }
};

export const getTopCustomers = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/top-customers`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error obteniendo los clientes con más compras");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getTopCustomers:", error);
        throw error;
    }
};
