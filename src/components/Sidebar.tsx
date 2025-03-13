import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Menu, X, UserCheck, BarChartBig, UserCog, PackageCheck, Store, HandCoins, UsersRound, ShoppingBasket, Speech, Boxes } from "lucide-react";
import { useAuthStore, Role } from '../store/useAuthStore';
import { jwtDecode } from 'jwt-decode'

const FuturisticNavLink = ({ to, label, Icon }: { to: string; label: string; Icon: React.ElementType }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `relative flex items-center w-full px-6 py-3 text-left font-semibold uppercase transition-all duration-300 rounded-md
            bg-gray-800 text-blue-300
            ${isActive ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" : ""} 
            hover:bg-gray-700 hover:text-white`
        }
    >
        <Icon size={20} className="mr-3" />
        {label}
    </NavLink>
);

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
    const { token } = useAuthStore();
    const decodedToken: { id_user: number; role: string } = jwtDecode(token ?? '');

    return (
        <>
            {/* Grupo de botones en móvil */}
            <div className="fixed bottom-4 left-4 z-50 sm:hidden flex flex-col items-center space-y-3">
                {/* ThemeToggle en móvil (ahora encima del botón de menú) */}
                <div className="bg-gray-900 p-2 rounded-full shadow-lg">
                    <ThemeToggle />
                </div>

                {/* Botón de menú */}
                <button
                    className="text-white bg-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900 dark:bg-gray-950 shadow-lg border-r border-blue-800 dark:border-blue-950
                transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-64"} sm:translate-x-0 z-40`}
            >
                <div className="flex flex-col h-full p-4 space-y-4">
                    <div className="text-blue-400 dark:text-blue-500 text-lg font-extrabold tracking-wider">
                        <NavLink to="/" onClick={() => setIsOpen(false)}> <HandCoins size={50} /></NavLink>
                    </div>

                    {/* Enlaces */}
                    <nav className="space-y-2">
                        {decodedToken.role === Role.ROOT || decodedToken.role === Role.ADMIN ? (
                            <>
                                <FuturisticNavLink to="/dashboard" label="Estadísticas" Icon={BarChartBig} />
                                <FuturisticNavLink to="/sales" label="Ventas" Icon={ShoppingBasket} />
                                <FuturisticNavLink to="/customers" label="Clientes" Icon={Speech} />
                                <FuturisticNavLink to="/products" label="Productos" Icon={PackageCheck} />
                                <FuturisticNavLink to="/receptions" label="Recepciones" Icon={Store} />
                                <FuturisticNavLink to="/suppliers" label="Proveedores" Icon={UsersRound} />
                                <FuturisticNavLink to="/stock" label="Stock" Icon={Boxes} />
                                <FuturisticNavLink to="/profile" label="Perfil" Icon={UserCheck} />

                                <FuturisticNavLink to="/users" label="Usuarios" Icon={UserCog} />
                            </>
                        ) : (
                            <>
                                <FuturisticNavLink to="/dashboard" label="Estadísticas" Icon={BarChartBig} />
                                <FuturisticNavLink to="/sales" label="Ventas" Icon={ShoppingBasket} />
                                <FuturisticNavLink to="/customers" label="Clientes" Icon={Speech} />
                                <FuturisticNavLink to="/products" label="Productos" Icon={PackageCheck} />
                                <FuturisticNavLink to="/receptions" label="Recepciones" Icon={Store} />
                                <FuturisticNavLink to="/suppliers" label="Proveedores" Icon={UsersRound} />
                                <FuturisticNavLink to="/stock" label="Stock" Icon={Boxes} />
                                <FuturisticNavLink to="/profile" label="Perfil" Icon={UserCheck} />
                            </>)}
                    </nav>

                    <div className="flex-grow"></div>

                    {/* ThemeToggle visible solo en desktop */}
                    <div className="hidden sm:flex justify-center">
                        <ThemeToggle />
                    </div>
                </div>
            </aside>

            {/* Fondo oscuro cuando el sidebar está abierto en móvil */}
            {isOpen && <div className="fixed inset-0 bg-black/50 sm:hidden z-30" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default Sidebar;