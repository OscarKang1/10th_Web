import ThemeProvider from "./context/ThemeProvider";
import ContextPage from "./pages/ContextPage";

function App() {
  return (
    <ThemeProvider>
      <ContextPage />
    </ThemeProvider>
  );
}

export default App;
