import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import { Sidebar } from "../components";
import { Role, useAuthStore } from "../store/useAuthStore";
import UsersAdministration from "../pages/UsersAdministration";
import ProtectedRouteByRole from "./ProtectedRouteByRole";
import ProductsAdministration from "../pages/ProductsAdministration";
import ReceptionsAdministration from "../pages/ReceptionsAdministration";
import NotFound from "../pages/NotFound";
import SuppliersAdministration from "../pages/SuppliersAdministration";
import SalesAdministration from "../pages/SalesAdministration";
import CustomersAdministration from "../pages/CustomersAdministration";
import StockAdministration from "../pages/StockAdministration";

const AppRoutes = () => {
    const { token } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Router basename="/mi-app">
            {token && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
            {/* Contenedor principal con margen si hay sidebar */}
            <div className={`transition-all ${token ? "sm:ml-64" : ""} ${isOpen ? "ml-3.5" : ""}`}>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={token ? <Navigate to={"/profile"} /> : <Login />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    <Route path="/products" element={
                        <ProtectedRoute>
                            <ProductsAdministration />
                        </ProtectedRoute>
                    } />

                    <Route path="/receptions" element={
                        <ProtectedRoute>
                            <ReceptionsAdministration />
                        </ProtectedRoute>
                    } />

                    <Route path="/suppliers" element={
                        <ProtectedRoute>
                            <SuppliersAdministration />
                        </ProtectedRoute>
                    } />

                    <Route path="/sales" element={
                        <ProtectedRoute>
                            <SalesAdministration />
                        </ProtectedRoute>
                    } />

                    <Route path="/customers" element={
                        <ProtectedRoute>
                            <CustomersAdministration />
                        </ProtectedRoute>
                    } />

                    <Route path="/stock" element={
                        <ProtectedRoute>
                            <StockAdministration />
                        </ProtectedRoute>
                    } />

                    <Route
                        path="/users" element={
                            <ProtectedRouteByRole allowedRoles={[Role.ROOT, Role.ADMIN]}>
                                <UsersAdministration />
                            </ProtectedRouteByRole>
                        }
                    />

                </Routes>
            </div>
        </Router>
    );
};

export default AppRoutes;