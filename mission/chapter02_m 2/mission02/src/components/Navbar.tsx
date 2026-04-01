import { useTheme } from "../context/ThemeProvider";
import ThemeToggleButton from "./ThemeToggleButton";

function Navbar() {
  const { isDark } = useTheme();

  return (
    <nav className={`flex justify-between items-center px-6 py-4 ${isDark ? "bg-gray-900" : "bg-blue-500"}`}>
      <h2 className="text-white text-xl font-bold m-0">OSCAAAAAAR</h2>
      <ThemeToggleButton />
    </nav>
  );
}

export default Navbar;
