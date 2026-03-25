import { useTheme } from "../context/ThemeProvider";

function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
        isDark
          ? "bg-yellow-400 text-gray-900"
          : "bg-gray-900 text-white"
      }`}
    >
      {isDark ? "☀️ 라이트 모드" : "🌙 다크 모드"} 
    </button>
  );
}

export default ThemeToggleButton;
