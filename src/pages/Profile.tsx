import { useEffect } from "react";
import { ButtonFuturistic, CardFuturistic } from "../components";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { PanelRightClose, UserCheck2Icon } from "lucide-react";

const Profile = () => {
    const navigate = useNavigate();
    const { user, fetchProfile, logout } = useAuthStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6">
            <CardFuturistic
                title="Perfil de Usuario"
                icon={UserCheck2Icon}
                Data={{
                    Nombre: user?.name ?? "N/A",
                    Correo: user?.email ?? "N/A",
                    Rol: user?.role ?? "N/A"
                }}
            >
                <ButtonFuturistic
                    label="Cerrar sesión"
                    onClick={handleLogout}
                    icon={PanelRightClose}
                    gradient="bg-gradient-to-r from-red-500 to-red-600"
                    className="w-60"
                />
            </CardFuturistic>

        </div>
    );
};

export default Profile;
