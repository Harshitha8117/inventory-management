import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Generic push
  const push = useCallback((message, type = "info", timeout = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, timeout);
  }, []);

  // Helpers like real toast libs
  const success = (msg) => push(msg, "success");
  const error = (msg) => push(msg, "error");
  const info = (msg) => push(msg, "info");

  const remove = (id) =>
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={{ push, success, error, info }}>
      {children}

      {/* Toasts UI */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={
              "px-4 py-2 rounded shadow text-white text-sm animate-slide " +
              (toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : "bg-gray-800")
            }
          >
            {toast.message}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide { animation: slide-in .2s ease-out; }
      `}</style>
    </ToastContext.Provider>
  );
}
