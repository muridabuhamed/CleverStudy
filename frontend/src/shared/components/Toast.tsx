import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    colors: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    titleColor: 'text-emerald-900 dark:text-emerald-100',
    messageColor: 'text-emerald-700 dark:text-emerald-300',
  },
  error: {
    icon: XCircle,
    colors: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-900 dark:text-red-100',
    messageColor: 'text-red-700 dark:text-red-300',
  },
  warning: {
    icon: AlertTriangle,
    colors: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-900 dark:text-amber-100',
    messageColor: 'text-amber-700 dark:text-amber-300',
  },
  info: {
    icon: Info,
    colors: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-900 dark:text-blue-100',
    messageColor: 'text-blue-700 dark:text-blue-300',
  },
};

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  React.useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.95, x: 100 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`${config.colors} border rounded-2xl shadow-lg backdrop-blur-sm p-4 min-w-[320px] max-w-md pointer-events-auto`}
    >
      <div className="flex items-start gap-3">
        {/* Icon with bounce animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.1,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className="flex-shrink-0"
        >
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.h4
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className={`font-semibold ${config.titleColor} text-sm`}
          >
            {toast.title}
          </motion.h4>
          {toast.message && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={`${config.messageColor} text-xs mt-1`}
            >
              {toast.message}
            </motion.p>
          )}
        </div>

        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDismiss(toast.id)}
          className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${config.iconColor}`}
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{
          duration: (toast.duration || 5000) / 1000,
          ease: 'linear',
        }}
        className={`h-1 mt-3 rounded-full origin-left ${config.iconColor.replace('text-', 'bg-')} opacity-30`}
      />
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};
