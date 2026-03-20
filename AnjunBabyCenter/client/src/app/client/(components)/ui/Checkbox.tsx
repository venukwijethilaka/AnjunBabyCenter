import React from 'react';

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative flex items-center justify-center w-5 h-5">
      <input
        type="checkbox" ref={ref}
        // ✅ CHANGED: Uses theme-primary for the checked state
        className={`peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-lg bg-white 
        checked:bg-theme-primary checked:border-theme-primary 
        focus:ring-2 focus:ring-theme-border focus:outline-none 
        cursor-pointer transition-all duration-200 ${className}`}
        {...props}
      />
      {/* The Tick Icon (White text on Theme background) */}
      <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity transform peer-checked:scale-100 scale-50 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </div>
  )
);
Checkbox.displayName = "Checkbox";