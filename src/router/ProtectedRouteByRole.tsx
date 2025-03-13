import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { JSX, useEffect } from "react";

interface Props {
    children: JSX.Element;
    allowedRoles: string[];
}

const ProtectedRouteByRole = ({ children, allowedRoles }: Props) => {
    const { user, fetchProfile } = useAuthStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (!allowedRoles.includes(user?.role || "")) return <Navigate to={"/"} />;

    return children;
};

export default ProtectedRouteByRole;
