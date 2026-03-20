import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>}
        {/* ✅ CHANGED: focus ring now uses theme-primary */}
        <input
          ref={ref}
          className={`w-full px-5 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent transition-all placeholder:text-gray-400 bg-white text-gray-900 ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";