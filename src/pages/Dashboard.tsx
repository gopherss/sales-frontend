import { JSX, FC, useEffect } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import { TitleFuturistic } from "../components";
import {
    ResponsiveContainer, XAxis, YAxis, Tooltip,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard: FC = (): JSX.Element => {
    const { salesSummary, paymentMethods, topProducts, topUsers, topCustomers, loadingDashboard,
        fetchSalesSummary, fetchPaymentMethods, fetchTopProducts, fetchTopUsers, fetchTopCustomers
    } = useDashboardStore();

    useEffect(() => {
        fetchSalesSummary();
        fetchPaymentMethods();
        fetchTopProducts();
        fetchTopUsers();
        fetchTopCustomers();
    }, [fetchSalesSummary, fetchPaymentMethods, fetchTopProducts, fetchTopUsers, fetchTopCustomers]);

    return (
        <div className="lg:px-10 lg:pt-5">
            <TitleFuturistic children="Bienvenido al Dashboard" as="h1" />
            {loadingDashboard ? (
                <div className="flex justify-center items-center h-60">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
            ) : (
                <>

                    {/* Sección de Gráficos */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {/* Resumen de Ventas - Gráfico de Barras */}
                        {salesSummary && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Resumen de Ventas</h2>
                                <ResponsiveContainer width="95%" height={350}>
                                    <BarChart data={[
                                        { name: "Hoy", value: salesSummary.salesToday },
                                        { name: "Semana", value: salesSummary.salesWeek },
                                        { name: "Mes", value: salesSummary.salesMonth },
                                        { name: "Año", value: salesSummary.salesYear },
                                    ]}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `S/ ${value}`} />
                                        <Bar dataKey="value" fill="#4F46E5" radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Métodos de Pago - Gráfico de Pastel */}
                        {paymentMethods && paymentMethods.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Métodos de Pago Más Utilizados</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={paymentMethods}
                                            dataKey="count"
                                            nameKey="method"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={110}
                                            label={({ value }) => `${value}`}
                                            labelLine={false}
                                        >
                                            {paymentMethods.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ cursor: "pointer" }} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${((value as number) * 100 / paymentMethods.reduce((acc, cur) => acc + cur.count, 0)).toFixed(2)}%`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Productos Más Vendidos - Gráfico de Barras */}
                        {topProducts && topProducts.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Productos Más Vendidos</h2>
                                <ResponsiveContainer width="95%" height={350}>
                                    <BarChart data={topProducts} layout="vertical">
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={150} />
                                        <Tooltip />
                                        <Bar dataKey="total_sold" fill="#4F46E5" radius={[0, 10, 10, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Sección de Tablas */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Usuarios con Más Ventas */}
                        {topUsers && topUsers.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Usuarios con Más Ventas</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-200 dark:border-gray-700">
                                        <thead>
                                            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                                <th className="border px-4 py-2 text-left">Usuario</th>
                                                <th className="border px-4 py-2 text-left">Rol</th>
                                                <th className="border px-4 py-2 text-left">Total Ventas</th>
                                                <th className="border px-4 py-2 text-left">Monto Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topUsers.map((user, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                                    <td className="border px-4 py-2">{user.name}</td>
                                                    <td className="border px-4 py-2">{user.role}</td>
                                                    <td className="border px-4 py-2">{user.total_sales}</td>
                                                    <td className="border px-4 py-2">S/ {user.total_sold.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Clientes con Más Compras */}
                        {topCustomers && topCustomers.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Clientes con Más Compras</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-200 dark:border-gray-700">
                                        <thead>
                                            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                                <th className="border px-4 py-2 text-left">Cliente</th>
                                                <th className="border px-4 py-2 text-left">Total Compras</th>
                                                <th className="border px-4 py-2 text-left">Total Gastado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topCustomers.map((customer, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                                    <td className="border px-4 py-2">{customer.name}</td>
                                                    <td className="border px-4 py-2">{customer.total_purchases}</td>
                                                    <td className="border px-4 py-2">S/ {customer.total_spent.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
