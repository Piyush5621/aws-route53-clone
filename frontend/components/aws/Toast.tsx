"use client";

import React, { createContext, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message?: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md w-full px-4 select-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start justify-between p-3 rounded shadow-xl border text-xs transition-all animate-bounce-short ${
              toast.type === "success"
                ? "bg-[#1b2b1d] border-green-600 text-green-200"
                : toast.type === "error"
                ? "bg-[#331818] border-red-600 text-red-200"
                : "bg-[#1b2533] border-[#384c63] text-gray-200"
            }`}
          >
            <div className="flex items-start space-x-2">
              {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />}
              {toast.type === "error" && <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
              {toast.type === "info" && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold">{toast.title}</p>
                {toast.message && <p className="text-[11px] opacity-90 mt-0.5">{toast.message}</p>}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white p-0.5 ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
