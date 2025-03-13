import { useEffect, useState, JSX, FC } from "react";
import { Banknote, Calendar, LoaderPinwheel, Pencil, Plus, Wallet } from "lucide-react";
import { ProductReceptions, useReceptionStore } from "../store/useReceptionStore";
import { useAuthStore } from "../store/useAuthStore";
import { ButtonFuturistic, InputFuturistic, ModalFuturistic, TitleFuturistic, ProductAutocomplete, SupplierAutocomplete } from "../components";
import TableFuturistic, { Column } from "../components/TableFuturistic";
import toast from "react-hot-toast";
import { formatDate } from "../utils/functionDate";
import { jwtDecode } from "jwt-decode";

const ReceptionsAdministration: FC = (): JSX.Element => {
    const { token } = useAuthStore();
    const decodedToken: { id: number; role: string } = jwtDecode(token ?? '');
    const {
        productReceptions,
        paginationReception,
        loading,
        fetchProductReceptions,
        addProductReception,
        editProductReception,
    } = useReceptionStore();

    const getLocalDateString = (date: Date) => {
        return date.toLocaleDateString('fr-CA');
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Estado para nueva recepción
    const [isAddProductReceptionModalOpen, setIsAddProductReceptionModalOpen] = useState(false);
    const [newProductReception, setNewProductReception] = useState<Omit<ProductReceptions, "id_reception" | "createdAt" | "updatedAt" | "product_name" | "price" | "supplier_name" | "user_name">>({
        id_product: 0,
        quantity: 0,
        purchase_price: 0,
        id_supplier: 0,
        id_user: 0,
        date: getLocalDateString(new Date())
    });

    // Estado para edición de recepción
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedReception, setEditedReception] = useState<Partial<ProductReceptions> | null>(null);

    useEffect(() => {
        fetchProductReceptions(currentPage, 10, searchTerm);
    }, [fetchProductReceptions, currentPage, searchTerm]);

    const columns: Column<ProductReceptions>[] = [
        { key: "product_name", label: "Producto" },
        { key: "supplier_name", label: "Proveedor" },
        { key: "quantity", label: "Cantidad" },
        { key: "purchase_price", label: "Precio Compra" },
        {
            key: "date", label: "Fecha de Recepción",
            render: (value) => <span> {formatDate(value as string)} </span>
        },
    ];

    const handleAddProducReception = async () => {
        newProductReception.id_user = decodedToken.id;
        if (!newProductReception.id_product || !newProductReception.quantity || !newProductReception.purchase_price || !newProductReception.id_supplier) {
            toast.error("Faltan datos, por favor complétalos.");
            return;
        }
        const receptionToSend = {
            ...newProductReception,
            date: new Date(newProductReception.date).toISOString(), // Convierte a formato ISO
        };
        await addProductReception(receptionToSend);
        setIsAddProductReceptionModalOpen(false);
        setNewProductReception({ id_product: 0, quantity: 0, purchase_price: 0, id_supplier: 0, id_user: 0, date: new Date().toISOString().split("T")[0], });
    };

    const handleEditReception = async () => {
        if (!editedReception || !editedReception.id_reception) return;
        await editProductReception(editedReception.id_reception, editedReception);

        // Refrescamos la lista de recepciones para obtener los nombres correctos
        fetchProductReceptions(currentPage, 10, searchTerm);
        setIsEditModalOpen(false);
        setEditedReception(null);
    };


    return (
        <div className="lg:pr-10 lg:pl-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1">Gestión de Inventario</TitleFuturistic>
            <ButtonFuturistic
                label="Nueva Recepción"
                icon={Plus}
                onClick={() => setIsAddProductReceptionModalOpen(true)}
            />

            {/* Modal de nueva recepción */}
            <ModalFuturistic isOpen={isAddProductReceptionModalOpen} onClose={() => setIsAddProductReceptionModalOpen(false)} title="Nuevo Inventario">
                <div className="grid grid-cols-2 gap-4">
                    <ProductAutocomplete onSelect={(product) => setNewProductReception(prev => ({ ...prev, id_product: product.id_product }))} />
                    <SupplierAutocomplete onSelect={(supplier) => setNewProductReception((prev) => ({ ...prev, id_supplier: supplier.id_supplier }))} />
                    <InputFuturistic label="Cantidad" icon={Wallet} type="number" placeholder="0" value={newProductReception.quantity || ""} onChange={(e) =>
                        setNewProductReception((prev) => ({ ...prev, quantity: Number(e.target.value) }))
                    } />
                    <InputFuturistic label="Precio de Compra" icon={Banknote} type="number" placeholder="S/" value={newProductReception.purchase_price || ""} onChange={(e) =>
                        setNewProductReception((prev) => ({ ...prev, purchase_price: Number(e.target.value) }))
                    } />
                    <InputFuturistic label="Fecha de Recepción" icon={Calendar} type="date" value={newProductReception.date}
                        onChange={(e) => setNewProductReception((prev) => ({ ...prev, date: e.target.value }))}
                    />
                    <div className="col-span-2">
                        <ButtonFuturistic
                            label={loading ? "" : "Guardar Cambios"}
                            icon={loading ? LoaderPinwheel : Pencil}
                            onClick={handleAddProducReception}
                            disabled={loading}
                            className="mt-3 w-full"
                        />
                    </div>
                </div>
            </ModalFuturistic>

            {/* Modal de edición */}
            <ModalFuturistic isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Recepción">
                {editedReception && (
                    <div className="grid grid-cols-2 gap-4">
                        <ProductAutocomplete onSelect={(product) => setEditedReception(prev => ({ ...prev!, id_product: product.id_product }))} />
                        <SupplierAutocomplete onSelect={(supplier) => setEditedReception(prev => ({ ...prev!, id_supplier: supplier.id_supplier }))} />
                        <InputFuturistic label="Cantidad" icon={Wallet} type="number" placeholder="0" value={editedReception.quantity || ""} onChange={(e) =>
                            setEditedReception(prev => ({ ...prev!, quantity: Number(e.target.value) }))
                        } />
                        <InputFuturistic label="Precio de Compra" icon={Banknote} type="number" placeholder="S/" value={editedReception.purchase_price || ""} onChange={(e) =>
                            setEditedReception(prev => ({ ...prev!, purchase_price: Number(e.target.value) }))
                        } />
                        <div className="col-span-2">
                            <ButtonFuturistic
                                label={loading ? "" : "Actualizar"}
                                icon={loading ? LoaderPinwheel : Pencil}
                                onClick={handleEditReception}
                                disabled={loading}
                                className="mt-3 w-full"
                            />
                        </div>
                    </div>
                )}
            </ModalFuturistic>

            <TableFuturistic
                columns={columns}
                data={productReceptions}
                currentPage={currentPage}
                totalPages={paginationReception?.totalPages || 1}
                onPageChange={setCurrentPage}
                onSearch={setSearchTerm}
                loading={loading}
                actions={(row) => (
                    <ButtonFuturistic
                        icon={Pencil}
                        gradient="bg-gradient-to-r from-green-500 to-teal-600"
                        onClick={() => {
                            setEditedReception(row);
                            setIsEditModalOpen(true);
                        }}
                    >
                        Editar
                    </ButtonFuturistic>
                )}
            />
        </div>
    );
};

export default ReceptionsAdministration;
