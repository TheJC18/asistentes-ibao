import { useTheme } from "../../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ThemeTogglerTwo() {
  const { toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center text-white transition-colors rounded-full size-14 bg-brand-500 hover:bg-brand-600"
    >
      {/* Luna para dark, sol para light */}
      <FontAwesomeIcon icon={["fas", "moon"]} className="hidden dark:block text-2xl" />
      <FontAwesomeIcon icon={["fas", "sun"]} className="dark:hidden text-2xl" />
    </button>
  );
}
