import { FC, JSX, useState } from "react";
import { ButtonFuturistic, InputFuturistic, TitleFuturistic, ProductAutocomplete, SelectFuturistic, ShoppingCart } from "../components";
import { Banknote, LoaderPinwheel, NotebookPen, PencilLine, Save, Search } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Product } from "../store/useProductStore";
import toast from "react-hot-toast";
import { paymentMethods } from "../constants";
import { Customer, useCustomerStore } from "../store/useCustomerStore";
import { useSalesStore } from "../store/useSalesStore";
import { useAuthStore } from "../store/useAuthStore";
import { Sale } from "../services/sales.service";

const SalesAdministration: FC = (): JSX.Element => {
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
    const [highlightId, setHighlightId] = useState<number | null>(null);
    const [dniSearch, setDniSearch] = useState("");
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [operationNumber, setOperationNumber] = useState<string>("");
    const { loading, searchCustomer, addCustomer } = useCustomerStore();
    const { registerSale, loadingSale } = useSalesStore();
    const { token } = useAuthStore();

    const decodedToken: { id: number; role: string } = jwtDecode(token ?? '');
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const handleSearchByDni = async () => {
        if (!/^\d{8}$/.test(dniSearch)) {
            toast.error("El DNI debe tener 8 dígitos");
            return;
        }
        const result = await searchCustomer(dniSearch);
        if (result === "not_found") {
            toast.error("Cliente no encontrado, registrar manualmente");
            setCustomer({ id_customer: 0, dni: dniSearch, name: "", first_surname: "", second_surname: "", createdAt: "", updatedAt: "" });
        } else if (result) {
            setCustomer(result);
        }
    };

    const handleSaveCustomer = async () => {
        if (!customer || !customer.name || !customer.first_surname) {
            toast.error("Completa los campos obligatorios");
            return;
        }

        try {
            const newCustomer = await addCustomer({
                dni: customer.dni,
                name: customer.name,
                first_surname: customer.first_surname,
                second_surname: customer.second_surname || "",
            });

            if (newCustomer) setCustomer(newCustomer);
        } catch (error) {
            console.error("Error al guardar el cliente:", error);
            toast.error("Error al guardar el cliente");
        }
    };

    const handleProductSelect = (product: Product) => {
        console.info({
            nombre: product.name,
            cantidadDiponible: product.stock,
        });

        if (product.stock === 0) {
            toast.error("No hay stock disponible")
            return
        }

        setCart(prevCart => {
            const index = prevCart.findIndex(item => item.product.id_product === product.id_product);
            if (index !== -1) {
                return prevCart.map((item, i) =>
                    i === index ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { product, quantity: 1 }];
        });

        setHighlightId(product.id_product);
        setTimeout(() => setHighlightId(null), 1500);
        toast.success(`${product.name} añadido al carrito quedan ${product.stock}`);
    };

    const updateQuantity = (id: number, quantity: number) => {
        setCart(prevCart =>
            prevCart
                .map(item => item.product.id_product === id ?
                    { ...item, quantity: Math.max(0, quantity) } : item)
                .filter(item => item.quantity > 0)
        );
    };
    const removeProduct = (id: number) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            setCart(prevCart => prevCart.filter(item => item.product.id_product !== id));
            toast.success("Producto eliminado");
        }
    };

    const clearCart = () => {
        if (cart.length && window.confirm("¿Estás seguro de vaciar el carrito?")) {
            setCart([]);
            toast.success("Carrito vaciado");
        }
    };

    const handleRegisterSale = async (): Promise<void> => {
        if (!cart.length) {
            toast.error("El carrito está vacío");
            return;
        }
        if (!customer || customer.id_customer === 0) {
            toast.error("Debe seleccionar un cliente");
            return;
        }
        if (!paymentMethod) {
            toast.error("Debe seleccionar un método de pago");
            return;
        }
        if (!operationNumber) {
            toast.error("Debe ingresar el número de operación");
            return;
        }

        // Obtenemos la fecha actual en formato ISO
        const saleDate = new Date().toISOString();

        const sale: Sale = {
            id_user: decodedToken.id,
            id_customer: customer.id_customer,
            payment_method: paymentMethod,
            operation_number: operationNumber,
            date: saleDate, // ✅ Agregar la fecha
            customer: {
                name: customer.name,
                first_surname: customer.first_surname,
                second_surname: customer.second_surname || "",
            }, // ✅ Agregar el cliente
            details: cart.map(item => ({
                id_product: item.product.id_product,
                quantity: item.quantity,
                unit_price: item.product.price,
                id_sale: 0, // Si el API lo requiere, puedes enviarlo como 0 o evitarlo si no es obligatorio
                id_detail: 0, // Similar a id_sale, dependiendo de la API
                createdAt: saleDate,
                updatedAt: saleDate,
                product: item.product, // Si `product` es requerido en `SaleDetail`
            })),
        };

        const success = await registerSale(sale);
        if (success) {
            setCustomer(null);
            setDniSearch("");
            setCart([]);
        } else {
            console.log('Ucurrió un error al registrar la venta')
        }
    };


    return (
        <div className="lg:px-10 px-4 py-6">
            <TitleFuturistic as="h1" className="text-center mb-8">Administración de Ventas</TitleFuturistic>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                {/* Cliente */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg bg-white dark:bg-gray-800/50">
                    <TitleFuturistic as="h2" className="text-lg mb-4">Información del Cliente</TitleFuturistic>

                    <div className="space-y-4">
                        {/* DNI y Consulta */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <InputFuturistic
                                    label="DNI"
                                    icon={PencilLine}
                                    placeholder="01234567"
                                    value={dniSearch}
                                    maxLength={8}
                                    onChange={(e) => setDniSearch(e.target.value.replace(/\D/g, "").slice(0, 8))}
                                />
                            </div>
                            <ButtonFuturistic
                                label={loading ? "" : "Consultar Cliente"}
                                icon={loading ? LoaderPinwheel : Search}
                                className="w-full md:w-auto mt-2 md:mt-6"
                                onClick={handleSearchByDni}
                            />
                        </div>


                        {/* Nombre y Apellidos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputFuturistic
                                label="Nombre"
                                icon={NotebookPen}
                                placeholder="Nombre"
                                value={customer?.name || ""}
                                readOnly={customer?.id_customer !== 0} // Solo si el cliente ya existe
                                onChange={(e) => setCustomer({ ...customer!, name: e.target.value })}
                            />
                            <InputFuturistic
                                label="Primer Apellido"
                                icon={NotebookPen}
                                placeholder="Primer Apellido"
                                value={customer?.first_surname || ""}
                                readOnly={customer?.id_customer !== 0}
                                onChange={(e) => setCustomer({ ...customer!, first_surname: e.target.value })}
                            />
                            <InputFuturistic
                                label="Segundo Apellido"
                                icon={NotebookPen}
                                placeholder="Segundo Apellido"
                                value={customer?.second_surname || ""}
                                readOnly={customer?.id_customer !== 0}
                                onChange={(e) => setCustomer({ ...customer!, second_surname: e.target.value })}
                            />
                            <ButtonFuturistic
                                label={loading ? "" : "Guardar Cliente"}
                                icon={loading ? LoaderPinwheel : Save}
                                disabled={!customer || !customer.name || !customer.first_surname}
                                onClick={handleSaveCustomer}
                            />
                        </div>
                    </div>

                    {/* Selector de Producto */}
                    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <TitleFuturistic as="h2" className="text-lg mb-4">Agregar Producto</TitleFuturistic>
                        <ProductAutocomplete onSelect={handleProductSelect} />
                    </div>

                    {/* Método de Pago */}
                    <div className="mt-6">
                        <SelectFuturistic
                            icon={Banknote}
                            label="Método de Pago"
                            options={[{ value: "", label: "Selecciona un método de pago" }, ...paymentMethods]}
                            value={paymentMethod} // ✅ Asegurar que muestre el valor actual
                            onChange={(e) => setPaymentMethod(e.target.value)} // ✅ Actualiza el estado cuando el usuario seleccione un método
                        />
                    </div>
                    <InputFuturistic
                        label="Número de operación"
                        icon={NotebookPen}
                        placeholder="Ingrese el número de operación"
                        value={operationNumber}
                        onChange={(e) => setOperationNumber(e.target.value)}
                    />
                </div>

                {/* Carrito */}
                <ShoppingCart
                    cart={cart}
                    highlightId={highlightId}
                    updateQuantity={updateQuantity}
                    removeProduct={removeProduct}
                    clearCart={clearCart}
                    registerSale={handleRegisterSale}
                    total={total} // ✅ Pasamos el total calculado desde aquí
                    loadingSale={loadingSale}
                    customerSelected={!!customer} // ✅ Se convierte en booleano
                    paymentMethodSelected={!!paymentMethod} // ✅ Se convierte en booleano
                />

            </div>
        </div>
    );
};

export default SalesAdministration;
