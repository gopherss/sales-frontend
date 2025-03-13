import { create } from "zustand";
import { getSalesSummary, getPaymentMethods, getTopProducts, getTopUsers, getTopCustomers } from "../services/dashboard.service";

interface SalesSummary {
    salesToday: number;
    salesWeek: number;
    salesMonth: number;
    salesYear: number;
}

interface PaymentMethods {
    method: string;
    count: number;
}

interface TopProduct {
    id_product: number;
    name: string;
    sku: string;
    total_sold: number;
}

interface TopUser {
    id_user: number;
    name: string;
    role: string;
    total_sales: number;
    total_sold: number;
}

interface TopCustomer {
    id_customer: number;
    name: string;
    total_purchases: number;
    total_spent: number;
}

interface DashboardState {
    salesSummary: SalesSummary | null;
    paymentMethods: PaymentMethods[] | null;
    topProducts: TopProduct[] | null;
    topUsers: TopUser[] | null;
    topCustomers: TopCustomer[] | null;
    loadingDashboard: boolean;
    fetchSalesSummary: () => Promise<void>;
    fetchPaymentMethods: () => Promise<void>;
    fetchTopProducts: () => Promise<void>;
    fetchTopUsers: () => Promise<void>;
    fetchTopCustomers: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    salesSummary: null,
    paymentMethods: null,
    topProducts: null,
    topUsers: null,
    topCustomers: null,
    loadingDashboard: false,

    fetchSalesSummary: async () => {
        try {
            set({ salesSummary: null }); // Reiniciar antes de cargar
            const data = await getSalesSummary();
            set({ salesSummary: data });
        } catch (error) {
            console.error("Error al obtener el resumen de ventas", error);
        }
    },
    fetchPaymentMethods: async () => {
        try {
            set({ loadingDashboard: true });
            const data = await getPaymentMethods();
            set({ paymentMethods: data });
            set({ loadingDashboard: false });
        } catch (error) {
            console.error("Error al obtener los métodos de pago", error);
            set({ loadingDashboard: false });
        }
    },
    fetchTopProducts: async () => {
        try {
            set({ loadingDashboard: true });
            const data = await getTopProducts();
            set({ topProducts: data });
            set({ loadingDashboard: false });
        } catch (error) {
            console.error("Error al obtener los productos más vendidos", error);
            set({ loadingDashboard: false });
        }
    },
    fetchTopUsers: async () => {
        try {
            set({ loadingDashboard: true });
            const data = await getTopUsers();
            set({ topUsers: data, loadingDashboard: false });
        } catch (error) {
            console.error("Error al obtener los usuarios con más ventas", error);
            set({ loadingDashboard: false });
        }
    },
    fetchTopCustomers: async () => {
        try {
            set({ loadingDashboard: true });
            const data = await getTopCustomers();
            set({ topCustomers: data });
            set({ loadingDashboard: false });
        } catch (error) {
            console.error("Error al obtener los clientes con más compras", error);
            set({ loadingDashboard: false });
        }
    },
}));
