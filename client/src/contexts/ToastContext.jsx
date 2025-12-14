import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss: errors stay longer (6s), others 4s
    const duration = type === 'error' ? 6000 : 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = useCallback({
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error'),
    warning: (message) => addToast(message, 'warning'),
    info: (message) => addToast(message, 'info'),
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-8 left-5 z-9999 flex flex-col items-start gap-2 pointer-events-none">
        {toasts.map(toastItem => (
          <Toast
            key={toastItem.id}
            message={toastItem.message}
            type={toastItem.type}
            onClose={() => removeToast(toastItem.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
