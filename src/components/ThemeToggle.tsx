import { useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        document.body.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 bg-white/20 text-white rounded-full transition-all hover:bg-white/30"
        >
            {theme === "dark" ? (
                <Sun className="h-6 w-6 text-yellow-400" />
            ) : (
                <Moon className="h-6 w-6 text-sky-400" />
            )}
        </button>
    );
};

export default ThemeToggle;
