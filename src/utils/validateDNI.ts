import toast from "react-hot-toast";

export const validateDNI = (dni: string) => {
    if (!/^\d{8}$/.test(dni)) {
        toast.error("El DNI debe tener exactamente 8 dígitos numéricos");
        return false;
    }
    return true;
};
