import { useState } from "react";
import { motion } from "framer-motion";

const TruncatedText = ({ text, maxLength = 50 }: { text: string; maxLength?: number }) => {
    const [expanded, setExpanded] = useState(false);

    if (!text) return "N/A"; // Si es vacío o null, mostrar "N/A"

    const toggleExpand = () => setExpanded(!expanded);

    return (
        <div className="inline-block">
            <motion.span
                onClick={toggleExpand}
                className="cursor-pointer font-medium text-blue-500 dark:text-blue-500 transition-all"
                whileHover={{ scale: 1.05 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {expanded ? text : text.length > maxLength ? text.slice(0, maxLength) + "..." : text}
            </motion.span>
            {expanded && (
                <motion.span
                    onClick={toggleExpand}
                    className="ml-2 cursor-pointer text-orange-500 dark:text-yellow-500 text-sm font-semibold"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                >
                    (Ocultar)
                </motion.span>
            )}
        </div>
    );
};

export default TruncatedText;
