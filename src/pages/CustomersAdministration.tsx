import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Customer, useCustomerStore } from "../store/useCustomerStore";
import {
    ButtonFuturistic,
    InputFuturistic,
    ModalFuturistic,
    TitleFuturistic,
    TableFuturistic
} from "../components";
import { LoaderPinwheel, Pencil, Plus, Save } from "lucide-react";
import { validateDNI } from "../utils/validateDNI";

const CustomersAdministration = () => {
    const {
        customers, paginationCustomer, loading, fetchCustomers, addCustomer, editCustomer
    } = useCustomerStore();

    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
    const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [newCustomer, setNewCustomer] = useState({ name: "", first_surname: "", second_surname: "", dni: "" });
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);


    const handleAddCustomer = async () => {
        if (!newCustomer.name || !newCustomer.first_surname || !newCustomer.dni) {
            toast.error("Todos los campos son obligatorios");
            return;
        }
        if (!validateDNI(newCustomer.dni)) return;

        await addCustomer(newCustomer);
        setIsAddCustomerModalOpen(false);
        setNewCustomer({ name: "", first_surname: "", second_surname: "", dni: "" });
    };

    const handleEditCustomer = async () => {
        if (!editingCustomer) return;

        if (!validateDNI(editingCustomer.dni)) return;

        await editCustomer(editingCustomer.id_customer, editingCustomer);
        setIsEditCustomerModalOpen(false);
        setEditingCustomer(null);
    };


    return (
        <div className="lg:pr-10 lg:pl-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1">Gestión de Clientes</TitleFuturistic>

            {/* Botón para añadir cliente */}
            <ButtonFuturistic
                label="Añadir Cliente"
                icon={Plus}
                onClick={() => setIsAddCustomerModalOpen(true)}
            />

            {/* Tabla de Clientes */}
            <TableFuturistic
                columns={[
                    { key: "name", label: "Nombre" },
                    { key: "first_surname", label: "Primer Apellido" },
                    { key: "second_surname", label: "Segundo Apellido" },
                    { key: "dni", label: "DNI" },
                ]}
                data={customers}
                currentPage={paginationCustomer?.page || 1}
                totalPages={paginationCustomer?.totalPages || 1}
                onPageChange={(page) => fetchCustomers(page, 10, searchTerm)}
                onSearch={(term) => {
                    setSearchTerm(term);
                    fetchCustomers(1, 10, term);
                }}
                actions={(customer) => (
                    <ButtonFuturistic
                        gradient="bg-gradient-to-r from-green-500 to-teal-600"
                        icon={Pencil}
                        onClick={() => { setEditingCustomer(customer); setIsEditCustomerModalOpen(true); }}
                    />
                )}
                loading={loading}
            />

            {/* Modal para Añadir Cliente */}
            <ModalFuturistic
                isOpen={isAddCustomerModalOpen}
                onClose={() => setIsAddCustomerModalOpen(false)}
                title="Añadir Cliente"
            >
                <InputFuturistic
                    label="Nombre"
                    placeholder="nombre: "
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
                <InputFuturistic
                    label="Primer Apellido"
                    placeholder="primer apellido: "
                    value={newCustomer.first_surname}
                    onChange={(e) => setNewCustomer({ ...newCustomer, first_surname: e.target.value })}
                />
                <InputFuturistic
                    label="Segundo Apellido"
                    placeholder="segundo apellido: "
                    value={newCustomer.second_surname}
                    onChange={(e) => setNewCustomer({ ...newCustomer, second_surname: e.target.value })}
                />
                <InputFuturistic
                    label="DNI"
                    placeholder="01234567"
                    value={newCustomer.dni}
                    maxLength={8}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 8);
                        setNewCustomer({ ...newCustomer, dni: value })
                    }}
                />
                <ButtonFuturistic label={loading ? "" : "Guardar Cliente"} icon={loading ? LoaderPinwheel : Save} onClick={handleAddCustomer} />
            </ModalFuturistic>

            {/* Modal para Editar Cliente */}
            <ModalFuturistic
                isOpen={isEditCustomerModalOpen}
                onClose={() => setIsEditCustomerModalOpen(false)}
                title="Editar Cliente"
            >
                {editingCustomer && (
                    <>
                        <InputFuturistic
                            label="Nombre"
                            placeholder="nombre"
                            value={editingCustomer.name}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                        />
                        <InputFuturistic
                            label="Primer Apellido"
                            placeholder="primer apellido"
                            value={editingCustomer.first_surname}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, first_surname: e.target.value })}
                        />
                        <InputFuturistic
                            label="Segundo Apellido"
                            placeholder="segundo apellido"
                            value={editingCustomer.second_surname}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, second_surname: e.target.value })}
                        />
                        <InputFuturistic
                            label="DNI"
                            placeholder="01234567"
                            value={editingCustomer?.dni || ""}
                            maxLength={8}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "").slice(0, 8);
                                setEditingCustomer({ ...editingCustomer, dni: value });
                            }}
                        />
                        <ButtonFuturistic label={loading ? "" : "Actualizar Cliente"} icon={loading ? LoaderPinwheel : Plus} onClick={handleEditCustomer} />
                    </>
                )}
            </ModalFuturistic>
        </div>
    );
};

export default CustomersAdministration;
