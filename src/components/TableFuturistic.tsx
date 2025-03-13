import { JSX, useState } from "react";
import {
    ChevronLeft, ChevronRight, MoreHorizontal,
    LoaderPinwheel, ArchiveX, Search, CircleX
} from "lucide-react";
import { motion } from "framer-motion";
import TruncatedText from "./TruncatedText";

export interface Column<T> {
    key: keyof T;
    label: string;
    icon?: JSX.Element; // Cambiado a JSX.Element para mayor flexibilidad
    render?: (value: T[keyof T], row: T) => JSX.Element;
}

interface PropsTable<T> {
    columns: Column<T>[];
    data: T[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onSearch?: (searchTerm: string) => void;
    actions?: (row: T) => JSX.Element;
    loading?: boolean;
}

const TableFuturistic = <T,>({ columns, data, currentPage, totalPages, onPageChange, onSearch, actions, loading }: PropsTable<T>) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) onSearch(searchTerm);
    };

    const clearSearch = () => {
        setSearchTerm("");
        if (onSearch) onSearch("");
    };

    const generatePagination = () => {
        const pages = [];
        const showEllipsis = totalPages > 2;
        const leftEllipsis = currentPage > 2;
        const rightEllipsis = currentPage < totalPages - 1;

        if (showEllipsis) {
            pages.push(1); // Primera página
            if (leftEllipsis) pages.push("...");
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (rightEllipsis) pages.push("...");
            pages.push(totalPages); // Última página
        } else {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="w-full overflow-hidden rounded-lg shadow-lg bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
            {/* 🔍 Barra de búsqueda */}
            <div className="pt-2 pb-2 border-b border-gray-300 dark:border-gray-700">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <CircleX size={18} />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                        <Search size={18} />
                    </button>
                </form>
            </div>

            {/* Tabla */}
            <div className="w-full overflow-x-auto">
                <motion.table className="w-full border-collapse min-w-[600px]">
                    <thead className="bg-gradient-to-r from-blue-400 to-purple-500 text-white dark:from-blue-600 dark:to-purple-700">
                        <tr>
                            {columns.map(({ key, label, icon: Icon }) => (
                                <th
                                    key={String(key)}
                                    className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm"
                                >
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        {Icon && Icon} {/* Renderiza el ícono si está definido */}
                                        {label}
                                    </div>
                                </th>
                            ))}
                            {actions && <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold">Acciones</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4">
                                    <div className="flex justify-center items-center">
                                        <LoaderPinwheel size={30} className=" text-gray-500 dark:text-gray-400 animate-spin" />
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? ( // Si no hay datos
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4">
                                    <div className="flex justify-center items-center gap-2">
                                        <ArchiveX size={30} className="text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-500 dark:text-gray-400">No encontrado</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            // Si hay datos, renderizar las filas
                            data.map((row, rowIndex) => (
                                <motion.tr
                                    key={rowIndex}
                                    className="border-b border-gray-300 hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: rowIndex * 0.1 }}
                                >
                                    {columns.map(({ key, render }) => (
                                        <td key={String(key)} className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                            {render
                                                ? render(row[key], row)
                                                : typeof row[key] === "number"
                                                    ? row[key]
                                                    : typeof row[key] === "string" && row[key].length > 50
                                                        ? <TruncatedText text={row[key]} />
                                                        : row[key] ? String(row[key]) : "N/A"}
                                        </td>
                                    ))}
                                    {actions && <td className="px-2 sm:px-4 py-2 sm:py-3 flex gap-2">{actions(row)}</td>}
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </motion.table>
            </div>

            {/* 🔹 Paginación optimizada */}
            <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 p-3 sm:p-4 bg-gray-200 dark:bg-gray-800 transition-colors">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg 
                ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"}`}
                >
                    <ChevronLeft size={16} />
                </button>

                {generatePagination().map((page, index) => (
                    <motion.button
                        key={index}
                        onClick={() => typeof page === "number" && onPageChange(page)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-xs sm:text-sm 
                    ${currentPage === page ? "bg-blue-500 text-white scale-110" : "hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"}`}
                        whileHover={{ scale: 1.1 }}
                    >
                        {page === "..." ? <MoreHorizontal size={16} /> : page}
                    </motion.button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg 
                ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"}`}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default TableFuturistic;