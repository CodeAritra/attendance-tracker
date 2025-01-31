import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContextProvider.jsx";
import { SubjectsProvider } from "./context/SubjectContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SubjectsProvider>
        <App />
      </SubjectsProvider>
    </AuthProvider>
  </StrictMode>
);
