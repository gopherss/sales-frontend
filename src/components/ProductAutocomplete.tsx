import { useEffect, useState, useRef } from "react";
import { PackageSearch, XCircle } from "lucide-react";
import { InputFuturistic } from "../components";
import { useProductStore, Product } from "../store/useProductStore";

const ProductAutocomplete = ({ onSelect }: { onSelect: (product: Product) => void }) => {
    const { fetchProducts, products, loading } = useProductStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [searchTriggered, setSearchTriggered] = useState(false); // New state to track if search was triggered by Enter

    useEffect(() => {
        if (searchTriggered && searchTerm.length > 1) {
            fetchProducts(1, 10, searchTerm);
            setShowDropdown(true);
            setSearchTriggered(false); // Reset the trigger
        }
    }, [searchTerm, searchTriggered, fetchProducts]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (product: Product) => {
        setSearchTerm(product.name);
        setShowDropdown(false);
        onSelect(product);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev < products.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter") {
            if (products.length > 0) {
                if (showDropdown) {
                    handleSelect(products[selectedIndex]);
                } else {
                    setSearchTriggered(true);
                }

            } else {
                setSearchTriggered(true);
            }
        }
    };

    const handleClear = () => {
        setSearchTerm("");
        setShowDropdown(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative flex items-center">
                <InputFuturistic
                    label="Producto"
                    icon={PackageSearch}
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                />
                {searchTerm && (
                    <XCircle
                        className="absolute right-1 top-14 transform -translate-y-1/2 text-orange-500 hover:text-red-500 cursor-pointer transition-all"
                        size={20}
                        onClick={handleClear}
                    />
                )}
            </div>

            {showDropdown && (
                <ul className="absolute w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                    rounded-md mt-1 max-h-48 overflow-y-auto shadow-xl z-50 
                    backdrop-blur-xl bg-opacity-95 dark:bg-opacity-80">
                    {loading ? (
                        <li className="p-3 text-gray-500 dark:text-gray-400 animate-pulse">Cargando...</li>
                    ) : products.length > 0 ? (
                        products.map((product, index) => (
                            <li
                                key={product.id_product}
                                className={`p-3 cursor-pointer transition-all duration-300 text-gray-900 dark:text-gray-200 
                                    ${selectedIndex === index
                                        ? "bg-gradient-to-r from-blue-600 to-purple-500 text-white dark:from-blue-500 dark:to-purple-400"
                                        : "hover:bg-blue-200 hover:text-gray-900 dark:hover:bg-blue-700 dark:hover:text-white"
                                    }`}
                                onClick={() => handleSelect(product)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                {product.name}
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-500 dark:text-gray-400">No se encontraron productos</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default ProductAutocomplete;