import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface CardProps {
    title?: string;
    Data?: Record<string, string>;
    icon?: LucideIcon;
    children?: ReactNode;
}

const CardFuturistic = ({ title, Data, icon: Icon, children }: CardProps) => {
    return (
        <div className="relative p-8 rounded-xl shadow-2xl dark:bg-gradient-to-r dark:from-purple-900 dark:to-blue-700 dark:text-white bg-gradient-to-r from-gray-100 to-white text-black w-full max-w-md">
            {/* Efecto de brillo */}
            <div className="absolute inset-0 bg-white/10 dark:bg-white/10 blur-lg rounded-xl" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-4"> {/* Añadido para espaciado vertical uniforme */}
                {Icon && <Icon size={50} className="mb-4 text-blue-700 dark:text-blue-300" />}
                <h2 className="text-3xl font-bold mb-4 text-gray-700 dark:text-gray-300">{title}</h2>

                <div className="w-full">
                    {Data && Object.entries(Data).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 px-4 bg-gray-100 dark:bg-white/10 rounded-md mb-2">
                            <span className="text-gray-700 dark:text-blue-200 font-semibold">{key}:</span>
                            <span className="text-black dark:text-white">{value}</span>
                        </div>
                    ))}
                </div>

                {/* Aquí se renderizan los children, como el ButtonFuturistic */}
                <div className="mt-4 w-full flex flex-col items-center space-y-4"> {/* Añadido para espaciado vertical uniforme */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CardFuturistic;