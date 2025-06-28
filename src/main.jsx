import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast"; // Import Toaster

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <>
            <App />
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    className: "",
                    duration: 2000,
                    style: {
                        background: "#333",
                        color: "#fff",
                    },
                }}
            />{" "}
            {/* Add Toaster here */}
        </>
    </StrictMode>
);
