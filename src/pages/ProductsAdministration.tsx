import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Product, useProductStore } from "../store/useProductStore";
import { ButtonFuturistic, InputFuturistic, ModalFuturistic, TitleFuturistic, TableFuturistic, SelectFuturistic, TextareaFuturistic, SwitchFuturistic } from "../components";
import { LoaderPinwheel, Pencil, Plus, List, CheckCircle, XCircle, Banknote, Text, Boxes } from "lucide-react";

const ProductsAdministration = () => {
    const {
        categories, loading, fetchCategories, addCategory, editCategory,
        products, pagination, fetchProducts, addProduct, editProduct
    } = useProductStore();

    const [newCategory, setNewCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", unit_type: "", id_category: "" });
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [fetchCategories, fetchProducts]);

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            toast.error("El nombre de la categoría es obligatorio");
            return;
        }
        await addCategory(newCategory.trim());
        setNewCategory("");
    };

    const handleEditCategory = async () => {
        if (!editingCategory?.name.trim()) {
            toast.error("El nombre de la categoría es obligatorio");
            return;
        }
        await editCategory(editingCategory.id, editingCategory.name.trim());
        setEditingCategory(null);
        setIsModalOpen(false);
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.unit_type || !newProduct.id_category) {
            toast.error("Todos los campos son obligatorios");
            return;
        }
        await addProduct({ ...newProduct, price: parseFloat(newProduct.price), id_category: parseInt(newProduct.id_category) });
        setIsProductModalOpen(false);
        setNewProduct({ name: "", description: "", price: "", unit_type: "", id_category: "" });
    };

    return (
        <div className="lg:pr-10 lg:pl-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1" >Gestión de Productos</TitleFuturistic>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4 w-full space-y-6">

                    {/* Formulario para añadir categoría */}
                    <div className="dark:bg-gray-800 p-4 rounded-lg shadow-md mt-2">
                        <h2 className="text-white font-semibold mb-3">Nueva Categoría</h2>
                        <InputFuturistic placeholder="Nombre de la categoría" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                        <ButtonFuturistic label={loading ? "" : "Añadir"} icon={loading ? LoaderPinwheel : Plus} onClick={handleAddCategory} disabled={loading} className="mt-3 w-full" />
                    </div>

                    {/* Selector de categorías */}
                    <div className="dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        <h2 className="text-white font-semibold mb-3">Editar Categoría</h2>
                        <SelectFuturistic
                            label="Categoría"
                            options={[{ value: "", label: "Seleccionar Categoría" }, ...categories.map((c) => ({ label: c.name, value: c.id_category.toString() }))]}
                            icon={List}
                            value={selectedCategory || ""}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        />

                        <ButtonFuturistic
                            label="Editar"
                            icon={Pencil}
                            onClick={() => {
                                const category = categories.find((c) => c.id_category.toString() === selectedCategory);
                                if (category) {
                                    setEditingCategory({ id: category.id_category, name: category.name });
                                    setIsModalOpen(true);
                                } else {
                                    toast.error("Selecciona una categoría válida");
                                }
                            }}
                            disabled={!selectedCategory}
                            className="mt-3 w-full"
                        />
                    </div>
                </div>

                {/* Sección derecha: Tabla de productos */}
                <div className="lg:w-3/4 w-full">

                    <ButtonFuturistic
                        label="Añadir Producto"
                        icon={Plus} onClick={() => setIsProductModalOpen(true)}
                        disabled={categories.length === 0}
                    />

                    <ModalFuturistic isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Crear Nuevo Producto">
                        <InputFuturistic label="Nombre" placeholder="nombre: " value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                        <TextareaFuturistic label="Descripción" placeholder="Descripción" icon={Text} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                        <InputFuturistic label="Precio" placeholder="precio: " icon={Banknote} type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                        <InputFuturistic label="Unidad" placeholder="unidad: " icon={Boxes} value={newProduct.unit_type} onChange={(e) => setNewProduct({ ...newProduct, unit_type: e.target.value })} />
                        <SelectFuturistic
                            label="Categoría"
                            options={[{ value: "", label: "Selecciona un categoría" }, ...categories.map((c) => ({ label: c.name, value: c.id_category.toString() }))]}
                            value={newProduct.id_category}
                            onChange={(e) => setNewProduct({ ...newProduct, id_category: e.target.value })} />
                        <ButtonFuturistic label={loading ? "" : "Crear Producto"} icon={loading ? LoaderPinwheel : Plus} onClick={handleAddProduct} disabled={loading} className="mt-3 w-full" />
                    </ModalFuturistic>

                    <TableFuturistic
                        columns={[
                            { key: "name", label: "Nombre" },
                            { key: "description", label: "Descripción" },
                            { key: "price", label: "Precio S/" },
                            { key: "unit_type", label: "Unidad" },
                            { key: "sku", label: "SKU" },
                            {
                                key: "status", label: "Estado",
                                render: (value) => (
                                    value ? (
                                        <span className="flex items-center gap-1 text-green-400">
                                            <CheckCircle size={18} />
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-rose-400">
                                            <XCircle size={18} />
                                        </span>
                                    )
                                ),
                            },
                        ]}
                        data={products}
                        currentPage={pagination?.page || 1}
                        totalPages={pagination?.totalPages || 1}
                        onPageChange={(page) => fetchProducts(page, 10, searchTerm)}
                        onSearch={(term) => {
                            setSearchTerm(term);
                            fetchProducts(1, 10, term);
                        }}
                        actions={(product) => (
                            <ButtonFuturistic
                                icon={Pencil}
                                onClick={() => {
                                    setEditingProduct(product);
                                    setIsEditProductModalOpen(true);
                                }}
                                gradient="bg-gradient-to-r from-green-500 to-teal-600"
                            />
                        )}
                        loading={loading}
                    />
                </div>
            </div>

            <ModalFuturistic
                isOpen={isEditProductModalOpen}
                onClose={() => {
                    setIsEditProductModalOpen(false);
                    setEditingProduct(null);
                }}
                title="Editar Producto"
            >
                {editingProduct && (
                    <>
                        <InputFuturistic label="Nombre" placeholder="Nombre del producto" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                        <TextareaFuturistic label="Descripción" placeholder="Descripción del producto" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                        <InputFuturistic label="SKU" placeholder="sku: SKU115" value={editingProduct.sku === null ? "" : editingProduct.sku} onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })} />
                        <InputFuturistic label="Precio" placeholder="Precio" type="number" value={editingProduct.price.toString()} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })} />
                        <InputFuturistic label="Unidad" placeholder="Unidad" value={editingProduct.unit_type} onChange={(e) => setEditingProduct({ ...editingProduct, unit_type: e.target.value })} />
                        <SelectFuturistic
                            label="Categoría"
                            options={[{ value: "", label: "Selecciona un categoría" }, ...categories.map((c) => ({ label: c.name, value: c.id_category.toString() }))]}
                            value={editingProduct.id_category.toString() || ""}
                            onChange={(e) => setEditingProduct({ ...editingProduct, id_category: parseInt(e.target.value) })} />
                        <SwitchFuturistic label="Estado" checked={editingProduct.status} onChange={(checked) => setEditingProduct({ ...editingProduct, status: checked })} />
                        <ButtonFuturistic className="mt-3 w-full"
                            label={loading ? "" : "Guardar Cambios"}
                            icon={loading ? LoaderPinwheel : Pencil}
                            onClick={async () => {
                                if (!editingProduct) return;
                                await editProduct(editingProduct.id_product, editingProduct);
                                setIsEditProductModalOpen(false);
                            }}
                            disabled={loading}
                        />
                    </>
                )}
            </ModalFuturistic>


            {/* Modal para editar categoría */}
            <ModalFuturistic
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Editar Categoría"
            >
                <InputFuturistic
                    placeholder="Nuevo nombre"
                    value={editingCategory?.name || ""}
                    onChange={(e) =>
                        setEditingCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))
                    }
                />
                <div className="flex mt-4">
                    <ButtonFuturistic
                        className="w-full"
                        label={loading ? "" : "Guardar"}
                        icon={loading ? LoaderPinwheel : Plus}
                        onClick={handleEditCategory} disabled={loading} />
                </div>
            </ModalFuturistic>
        </div>
    );
};

export default ProductsAdministration;