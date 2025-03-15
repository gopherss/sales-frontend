import { FC, JSX, useCallback, useEffect, useState } from "react";
import { Edit, CheckCircle, XCircle, UserPlus, SaveAll, LoaderPinwheel } from "lucide-react";
import { ButtonFuturistic, InputFuturistic, TitleFuturistic, ModalFuturistic, SelectFuturistic, SwitchFuturistic } from "../components";
import TableFuturistic, { Column } from "../components/TableFuturistic";
import { useAuthStore, UserProfile, Role } from "../store/useAuthStore";
import { formatDate } from '../utils/functionDate';
import { validateEmail } from "../utils/validateEmail";
import { jwtDecode } from "jwt-decode";

const columns: Column<UserProfile>[] = [
    { key: "name", label: "Nombre" },
    { key: "email", label: "Correo Electrónico" },
    { key: "role", label: "Rol" },
    {
        key: "status",
        label: "Estado",
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
    {
        key: "createdAt",
        label: "Fecha de Creación",
        render: (value) => <span>{formatDate(value as string)}</span>
    },
];

const UsersAdministration: FC = (): JSX.Element => {
    const { token, users, loading, fetchUsers, updateUser, registerUser } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

    const [formData, setFormData] = useState({ name: "", email: "", role: Role.EMPLOYEE, status: false, password: "" });
    const [isFormValid, setIsFormValid] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const decodedToken: { id_user: number; role: string } = jwtDecode(token ?? '');

    useEffect(() => {
        const fetchData = async () => {
            await fetchUsers(currentPage, 10, searchTerm);
            const pagination = useAuthStore.getState().pagination;
            if (pagination) {
                setTotalPages(pagination.totalPages);
            }
        };
        fetchData();
    }, [fetchUsers, searchTerm, currentPage]);

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
        setCurrentPage(1); // Reiniciar a la primera página al buscar
    };

    const handleEdit = (user: UserProfile) => {
        setSelectedUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role, status: user.status, password: "" });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmitEdit = async () => {
        if (selectedUser) {
            const updatedData: Partial<UserProfile & { password?: string }> = {
                name: formData.name,
                email: formData.email,
                role: formData.role as Role,
                status: formData.status,
            };

            if (formData.password.trim()) {
                updatedData.password = formData.password;
            }

            await updateUser(selectedUser.id_user, updatedData);
            fetchUsers(currentPage, 10, searchTerm);
            setIsEditModalOpen(false);
        }
    };

    const handleRegisterUser = async () => {
        const success = await registerUser(formData);
        if (success) {
            fetchUsers(currentPage, 10, searchTerm);
            setIsRegisterModalOpen(false);
        }
    };

    const validateForm = useCallback(() => {
        const { name, email, password, role } = formData;

        const isValid =
            name.trim() !== "" &&
            email.trim() !== "" &&
            validateEmail(email) &&
            role !== undefined &&
            (isRegisterModalOpen ? password.trim() !== "" : true);

        setIsFormValid(isValid);
    }, [formData, isRegisterModalOpen]);

    useEffect(() => {
        validateForm();
    }, [validateForm]);

    return (
        <div className="lg:pr-10 lg:pl-10 lg:pt-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <TitleFuturistic as="h1">Gestión de Usuarios</TitleFuturistic>
                <ButtonFuturistic
                    label="Nuevo Usuario"
                    icon={UserPlus}
                    className="w-full sm:w-auto px-4 py-2 text-sm"
                    onClick={() => {
                        setFormData({ name: "", email: "", role: Role.EMPLOYEE, status: false, password: "" });
                        setIsRegisterModalOpen(true);
                    }}
                />
            </div>

            <TableFuturistic
                columns={columns}
                data={users}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onSearch={handleSearch} // Pasa la función de búsqueda
                loading={loading}
                actions={(user) => {
                    // Si el usuario logueado es ROOT, muestra el botón para todos los usuarios
                    if (decodedToken.role === Role.ROOT) {
                        return (
                            <ButtonFuturistic
                                icon={Edit}
                                onClick={() => handleEdit(user)}
                                gradient="bg-gradient-to-r from-green-500 to-teal-600"
                            />
                        );
                    }
                    // Si el usuario logueado es ADMIN, muestra el botón para otros ADMIN y EMPLOYEE, pero no para ROOT
                    if (decodedToken.role === Role.ADMIN) {
                        if (user.role !== Role.ROOT) {
                            return (
                                <ButtonFuturistic
                                    icon={Edit}
                                    onClick={() => handleEdit(user)}
                                    gradient="bg-gradient-to-r from-green-500 to-teal-600"
                                />
                            );
                        }
                        return <></>; // No mostrar botón para ROOT
                    }
                    return <></>;
                }}
            />

            {/* Modal para edición de usuario */}
            <ModalFuturistic isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Usuario">
                <div className="flex flex-col gap-3">
                    <InputFuturistic label="Nombre" type="text" placeholder="nombre:" name="name" value={formData.name} onChange={handleInputChange} />
                    <InputFuturistic label="Correo Electrónico" type="email" placeholder="email@example.com" name="email" value={formData.email} onChange={handleInputChange} />
                    <SelectFuturistic
                        label="Rol"
                        options={[
                            { value: "", label: "Selecciona un rol" },
                            ...Object.values(Role)
                                .filter(role => role !== Role.ROOT)
                                .map(role => ({ label: role, value: role }))
                        ]}
                        value={formData.role || ""}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })} />
                    <SwitchFuturistic label="Estado" checked={formData.status} onChange={(checked) => setFormData({ ...formData, status: checked })} />
                    <InputFuturistic label="Nueva Contraseña" type="password" placeholder="nueva contraseña:(opcional)" name="password" value={formData.password} onChange={handleInputChange} />
                    <ButtonFuturistic
                        label={loading ? "" : "Actualizar Usuario"}
                        onClick={handleSubmitEdit}
                        gradient="bg-gradient-to-r from-blue-500 to-purple-600"
                        disabled={!isFormValid || loading}
                        icon={loading ? LoaderPinwheel : SaveAll} />
                </div>
            </ModalFuturistic>

            {/* Modal para registrar nuevo usuario */}
            <ModalFuturistic isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title="Registrar Nuevo Usuario">
                <div className="flex flex-col gap-3">
                    <InputFuturistic label="Nombre" type="text" placeholder="nombre:" name="name" value={formData.name} onChange={handleInputChange} />
                    <InputFuturistic label="Correo Electrónico" type="email" placeholder="email@example.com" name="email" value={formData.email} onChange={handleInputChange} />
                    <InputFuturistic label="Contraseña" type="password" name="password" placeholder="contraseña:" value={formData.password} onChange={handleInputChange} />
                    <SelectFuturistic
                        label="Rol"
                        options={Object.values(Role)
                            .filter(role => role !== Role.ROOT)
                            .map(role => ({ label: role, value: role }))} value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })} />
                    <ButtonFuturistic
                        label={loading ? "" : "Registrar Usuario"}
                        onClick={handleRegisterUser}
                        disabled={!isFormValid || loading}
                        icon={loading ? LoaderPinwheel : SaveAll} />
                </div>
            </ModalFuturistic>
        </div>
    );
};

export default UsersAdministration;