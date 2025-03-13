import { create } from "zustand";
import { toast } from "react-hot-toast";
import { getSales, createSale, updateSale, Sale, SalesPagination } from "../services/sales.service";

interface SalesState {
    sales: Sale[];
    loadingSale: boolean;
    paginationSales: Omit<SalesPagination, "data"> | null;
    fetchSales: (page?: number, limit?: number, searchTerm?: string) => Promise<void>;
    registerSale: (sale: Sale) => Promise<boolean>;
    editSale: (id_sale: number, sale: Sale) => Promise<boolean>;
}

export const useSalesStore = create<SalesState>((set) => ({
    sales: [],
    paginationSales: null,
    loadingSale: false,

    // Obtener todas las ventas con paginación y búsqueda
    fetchSales: async (page = 1, limit = 10, searchTerm = "") => {
        set({ loadingSale: true });
        const response: SalesPagination | null = await getSales(page, limit, searchTerm);

        if (response) {
            set({
                sales: response.data,
                paginationSales: {
                    page: response.page,
                    limit: response.limit,
                    total: response.total,
                    totalPages: response.totalPages,
                },
            });
        } else {
            toast.error("Error al obtener las ventas");
        }
        set({ loadingSale: false });
    },

    // Registrar una nueva venta
    registerSale: async (sale: Sale) => {
        const { fetchSales } = useSalesStore.getState();
        set({ loadingSale: true });
        const response = await createSale(sale);

        if (response) {
            toast.success("Venta registrada con éxito");
            fetchSales(); // Actualizar la lista después de registrar
            set({ loadingSale: false });
            return true;
        } else {
            toast.error("Error al registrar la venta");
            set({ loadingSale: false });
            return false;
        }
    },

    // Editar una venta existente
    editSale: async (id_sale: number, sale: Sale) => {
        const { fetchSales } = useSalesStore.getState();
        set({ loadingSale: true });
        const response = await updateSale(id_sale, sale);
        if (response) {
            toast.success("Venta actualizada con éxito");
            fetchSales(); // Refrescar la lista de ventas
            set({ loadingSale: false });
            return true;
        } else {
            toast.error("Error al actualizar la venta");
            set({ loadingSale: false });
            return false;
        }
    },
}));
