import { LucideIcon } from "lucide-react";

interface PropsInput extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: LucideIcon;
}


const InputFuturistic = ({ label, placeholder, icon: Icon, ...props }: PropsInput) => (
    <div className="flex flex-col w-full relative">
        {label && (
            <label className="mb-2 text-blue-400 font-semibold">{label}</label>
        )}
        <div className="relative w-full">
            {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />}
            <input
                placeholder={placeholder}
                className={`text-blue-400 font-bold w-full px-4 py-2 text-lg border border-purple-500 rounded-lg shadow-md outline-none transition-all duration-300 ease-in-out bg-transparent focus:ring-2 focus:ring-purple-500 focus:border-blue-500 placeholder:text-purple-300 hover:border-blue-300 dark:text-white ${Icon ? 'pl-10' : ''}`}
                {...props}
            />
        </div>
    </div>
);

export default InputFuturistic;