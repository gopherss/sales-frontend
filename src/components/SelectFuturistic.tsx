import { LucideIcon } from "lucide-react";

interface PropsSelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { label: string; value: string }[];
    icon?: LucideIcon;
}

const SelectFuturistic = ({ label, options, icon: Icon, ...props }: PropsSelect) => (
    <div className="flex flex-col w-full relative">
        {label && <label className="mb-2 text-blue-400 font-semibold">{label}</label>}
        <div className="relative w-full">
            {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />}
            <select
                className={`text-blue-400 font-bold w-full px-4 py-2 text-lg border border-purple-500 rounded-lg shadow-md outline-none transition-all duration-300 ease-in-out bg-transparent focus:ring-2 focus:ring-purple-500 focus:border-blue-500 hover:border-blue-300 ${Icon ? 'pl-10' : ''}`}
                {...props}
            >
                {options.map((option, index) => (
                    <option
                        key={index}
                        value={option.value}
                        className="text-blue-400 font-bold dark:bg-gray-800 dark:text-white"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

export default SelectFuturistic;
