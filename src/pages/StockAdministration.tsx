import { FC, JSX, useEffect } from "react";
import { useStockStore } from "../store/useStockStore";
import { TitleFuturistic, TableFuturistic } from "../components";

const StockAdministration: FC = (): JSX.Element => {
    const { stock, paginationStock, loading, fetchStock } = useStockStore();

    useEffect(() => {
        fetchStock();
    }, [fetchStock]);

    return (
        <div className="lg:pr-10 lg:pl-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1">Búsqueda de Stock</TitleFuturistic>

            {/* Tabla de Stock */}
            <TableFuturistic
                columns={[
                    { key: "name", label: "Producto" },
                    { key: "stock", label: "Stock" },
                    { key: "price", label: "Precio" },
                    { key: "unit_type", label: "Unidad" },
                    { key: "category", label: "Categoría" },
                    { key: "sku", label: "SKU" },
                ]}
                data={stock}
                currentPage={paginationStock?.page || 1}
                totalPages={paginationStock?.totalPages || 1}
                onPageChange={(page) => fetchStock(page, 10)}
                onSearch={(term) => fetchStock(1, 10, term)}
                loading={loading}
            />
        </div>
    );
};

export default StockAdministration;
