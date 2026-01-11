import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>}
            <input
                className={`w-full px-4 py-2.5 rounded-xl border-2 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white transition-colors duration-200 outline-none
          ${error
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                    } ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600 ml-1">{error}</p>}
        </div>
    );
};
