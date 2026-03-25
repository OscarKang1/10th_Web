import { useTheme } from "../context/ThemeProvider";
import Navbar from "../components/Navbar";
import ThemeContent from "../components/ThemeContent";

function ContextPage() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors ${isDark ? "bg-blue-950" : "bg-white"}`}>
      <Navbar />
      <ThemeContent />
    </div>
  );
}

export default ContextPage;
