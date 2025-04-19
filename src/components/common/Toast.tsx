'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const baseStyles = "fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-y-0";
  const typeStyles = type === 'success' 
    ? "bg-green-500 text-white"
    : "bg-red-500 text-white";

  return (
    <div className={`${baseStyles} ${typeStyles}`}>
      {message}
    </div>
  );
} 