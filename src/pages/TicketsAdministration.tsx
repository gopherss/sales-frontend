import { useEffect, useState } from "react";
import { useSalesStore } from "../store/useSalesStore";
import {
    ButtonFuturistic, ModalFuturistic, TitleFuturistic,
    TableFuturistic, InputFuturistic, CustomerAutocomplete
} from "../components";
import { DockIcon, LoaderPinwheel, Pencil, Save } from "lucide-react";
import { Sale } from "../services/sales.service";
import generatePDF from "../utils/generatePDF";
import { formatDate } from "../utils/functionDate";

const TicketsAdministration = () => {
    const { sales, paginationSales, loadingSale, fetchSales } = useSalesStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditSaleModalOpen, setIsEditSaleModalOpen] = useState(false);
    const [editingSale, setEditingSale] = useState<Sale | null>(null);

    useEffect(() => {
        if (sales.length === 0) {
            fetchSales();
        }
    }, [fetchSales, sales]);

    return (
        <div className="lg:pr-10 lg:pl-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1">Gestión de Tickets</TitleFuturistic>

            <TableFuturistic
                columns={[
                    { key: "date", label: "Fecha", render: (value) => <span>{formatDate(value as string)}</span> },
                    { key: "customerName", label: "Cliente" },
                    { key: "payment_method", label: "Método de Pago" },
                    { key: "operation_number", label: "N° Operación" },
                    { key: "total", label: "Total (S/.)" }
                ]}
                data={sales.map(sale => ({
                    ...sale, // Mantiene todos los datos originales
                    customerName: `${sale.customer?.name || "N/A"} ${sale.customer?.first_surname || ""} ${sale.customer?.second_surname || ""}`
                }))}
                currentPage={paginationSales?.page || 1}
                totalPages={paginationSales?.totalPages || 1}
                onPageChange={(page) => fetchSales(page, 10, searchTerm)}
                onSearch={(term) => {
                    setSearchTerm(term);
                    fetchSales(1, 10, term);
                }}
                actions={(sale) => (
                    <>
                        <ButtonFuturistic
                            gradient="bg-gradient-to-r from-green-500 to-teal-600"
                            icon={Pencil}
                            onClick={() => {
                                console.log("Sale seleccionada:", sale);
                            }}
                        />
                        <ButtonFuturistic
                            gradient="bg-gradient-to-r from-red-600 to-rose-500"
                            icon={DockIcon}
                            onClick={() => generatePDF(sale)}
                        />
                    </>
                )}
                loading={loadingSale}
            />

            <ModalFuturistic
                isOpen={isEditSaleModalOpen}
                onClose={() => setIsEditSaleModalOpen(false)}
                title="Editar venta"
            >
                {editingSale && (
                    <>
                        {/* Componente de Autocompletado de Cliente */}
                        <CustomerAutocomplete
                            onSelect={(customer) => {
                                setEditingSale({ ...editingSale, id_customer: customer.id_customer });
                            }}
                        />
                        {/* Mostrar el cliente actual */}
                        <div className="text-gray-500 text-sm mt-1">
                            <TitleFuturistic as="h6">Cliente actual:  {editingSale?.customer?.name ?? "Cliente no encontrado"}</TitleFuturistic>
                        </div>

                        {/* Método de Pago */}
                        <InputFuturistic
                            type="text"
                            placeholder="Método de pago"
                            value={editingSale.payment_method}
                            onChange={(e) =>
                                setEditingSale({ ...editingSale, payment_method: e.target.value })
                            }
                        />

                        {/* Lista de Productos Vendidos */}
                        <div className="space-y-4">
                            {editingSale.details.map((detail, index) => (
                                <div key={index} className="flex gap-4">
                                    <InputFuturistic
                                        type="text"
                                        value={detail.product.name}
                                        disabled
                                    />
                                    <InputFuturistic
                                        type="number"
                                        placeholder="Cantidad"
                                        value={detail.quantity}
                                        onChange={(e) => {
                                            const updatedDetails = [...editingSale.details];
                                            updatedDetails[index].quantity = parseInt(e.target.value) || 0;
                                            setEditingSale({ ...editingSale, details: updatedDetails });
                                        }}
                                    />
                                    <InputFuturistic
                                        type="number"
                                        placeholder="Precio Unitario"
                                        value={detail.unit_price}
                                        onChange={(e) => {
                                            const updatedDetails = [...editingSale.details];
                                            updatedDetails[index].unit_price = parseFloat(e.target.value) || 0;
                                            setEditingSale({ ...editingSale, details: updatedDetails });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <ButtonFuturistic
                            label={loadingSale ? "" : "Actualizar venta"}
                            icon={loadingSale ? LoaderPinwheel : Save}
                        // onClick={handleEditSale}
                        />
                    </>
                )}
            </ModalFuturistic>
        </div>
    );
};

export default TicketsAdministration;
