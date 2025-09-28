import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { TestComponent } from "./TestComponent.tsx";
import "./index.css";

console.log("Main.tsx carregado");

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  console.log("Renderizando componente de teste...");
  
  // Temporariamente usando TestComponent para diagnóstico
  root.render(<TestComponent />);
  
  // Após 3 segundos, tenta carregar o App principal
  setTimeout(() => {
    console.log("Tentando carregar App principal...");
    root.render(<App />);
  }, 3000);
} else {
  console.error("Elemento root não encontrado!");
}
