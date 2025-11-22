import React, { createContext, useContext, useState, useCallback } from "react";

// Create context
const ToastContext = createContext();

// Hook for using toast
export function useToast() {
  return useContext(ToastContext);
}

// Toast Provider component (this is what we must export)
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // push new toast
  const push = useCallback((message, type = "info", timeout = 3500) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, timeout);
  }, []);

  const remove = (id) =>
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}

      {/* Toasts container */}
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
        .animate-slide {
          animation: slide-in .2s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
}
