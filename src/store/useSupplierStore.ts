import { create } from "zustand";
import { toast } from "react-hot-toast";
import { createSupplier, getSuppliers, updateSupplier } from "../services/supplier.service";

export interface Supplier {
    id_supplier: number;
    name: string;
    ruc: string;
    address: string;
    phone: string;
    contact: string;
    createdAt: string;
    updatedAt: string;
}

export interface SupplierPagination {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
    data: Supplier[];
}

interface SupplierState {
    token: string | null;
    suppliers: Supplier[];
    loading: boolean;
    paginationSupplier: Omit<SupplierPagination, "data"> | null;
    fetchSuppliers: (page?: number, limit?: number, searchTerm?: string) => Promise<void>;
    addSupplier: (supplier: Omit<Supplier, "id_supplier" | "createdAt" | "updatedAt">) => Promise<void>;
    editSupplier: (id: number, supplier: Partial<Supplier>) => Promise<void>;
}


export const useSupplierStore = create<SupplierState>((set) => ({
    token: localStorage.getItem("token"),
    suppliers: [],
    paginationSupplier: null,
    loading: false,

    fetchSuppliers: async (page = 1, limit = 10, searchTerm = "") => {
        set({ loading: true });
        const response: SupplierPagination | null = await getSuppliers(page, limit, searchTerm);
        if (response) {
            set({ suppliers: response.data, paginationSupplier: { page: response.page, limit: response.limit, total: response.total, totalPages: response.totalPages } });
        } else {
            toast.error("Error al obtener la lista de proveedores");
        }
        set({ loading: false });
    },

    addSupplier: async (supplier) => {
        set({ loading: true });
        const newSupplier = await createSupplier(supplier);
        if (newSupplier) {
            set((state) => ({ suppliers: [...state.suppliers, newSupplier] }));
            toast.success("Proveedor creado con éxito");
        } else {
            toast.error("Error al crear proveedor");
        }
        set({ loading: false });
    },

    editSupplier: async (id, supplier) => {
        set({ loading: true });
        const updatedSupplier = await updateSupplier(id, supplier);
        if (updatedSupplier) {
            set((state) => ({
                suppliers: state.suppliers.map((s) =>
                    s.id_supplier === id ? updatedSupplier : s
                ),
            }));
            toast.success("Proveedor actualizado");
        } else {
            toast.error("Error al actualizar proveedor");
        }
        set({ loading: false });
    },
}))