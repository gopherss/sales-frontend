import { create } from "zustand";
import { toast } from "react-hot-toast";
import { createCustomer, getCustomers, searchCustomerByDni, updateCustomer } from "../services/customer.service";

export interface Customer {
    id_customer: number;
    name: string;
    first_surname: string;
    second_surname: string;
    dni: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerPagination {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
    data: Customer[];
}

interface CustomerState {
    customers: Customer[];
    loading: boolean;
    paginationCustomer: Omit<CustomerPagination, "data"> | null;
    fetchCustomers: (page?: number, limit?: number, searchTerm?: string) => Promise<void>;
    addCustomer: (customer: Omit<Customer, "id_customer" | "createdAt" | "updatedAt">) => Promise<Customer | null>;
    editCustomer: (id: number, customer: Partial<Customer>) => Promise<void>;
    searchCustomer: (dni: string) => Promise<Customer | "not_found" | null>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
    customers: [],
    paginationCustomer: null,
    loading: false,

    fetchCustomers: async (page = 1, limit = 10, searchTerm = "") => {
        set({ loading: true });
        const response: CustomerPagination | null = await getCustomers(page, limit, searchTerm);

        if (response) {
            set({ customers: response.data, paginationCustomer: { page: response.page, limit: response.limit, total: response.total, totalPages: response.totalPages } });
        } else {
            toast.error("Error al obtener la lista de clientes");
        }
        set({ loading: false });
    },

    addCustomer: async (customer): Promise<Customer | null> => {
        set({ loading: true });
        try {
            const newCustomer = await createCustomer(customer);
            if (newCustomer) {
                set((state) => ({ customers: [...state.customers, newCustomer] }));
                toast.success("Cliente creado con éxito");
                return newCustomer;  // 👈 Retornar el nuevo cliente
            } else {
                toast.error("Error al crear cliente");
                return null;
            }
        } catch (error) {
            console.error("Error al crear cliente:", error);
            toast.error("Error al crear cliente");
            return null;
        } finally {
            set({ loading: false });
        }
    },

    editCustomer: async (id, customer) => {
        set({ loading: true });
        const updatedCustomer = await updateCustomer(id, customer);
        if (updatedCustomer) {
            set((state) => ({
                customers: state.customers.map((c) =>
                    c.id_customer === id ? updatedCustomer : c
                ),
            }));
            toast.success("Cliente actualizado");
        } else {
            toast.error("Error al actualizar cliente");
        }
        set({ loading: false });
    },
    searchCustomer: async (dni) => {
        set({ loading: true });
        const response = await searchCustomerByDni(dni);

        if (response?.found) {
            set({ loading: false });
            return response.data;
        } else {
            set({ loading: false });
            return "not_found";
        }
    },
}));
