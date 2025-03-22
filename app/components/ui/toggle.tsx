"use client";

import { ReactNode } from 'react';

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
}

export function Toggle({ id, checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between">
      {(label || description) && (
        <div>
          {label && <h3 className="text-sm font-medium text-buddha-blue-dark">{label}</h3>}
          {description && <p className="text-xs text-buddha-gray-500 mt-1">{description}</p>}
        </div>
      )}
      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
        <input 
          type="checkbox"
          id={id}
          className="opacity-0 w-0 h-0"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label 
          htmlFor={id}
          className={`absolute top-0 left-0 right-0 bottom-0 rounded-full cursor-pointer transition-colors duration-200 ${checked ? 'bg-buddha-orange' : 'bg-buddha-gray-300'}`}
        >
          <span 
            className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${checked ? 'transform translate-x-6' : ''}`}
          ></span>
        </label>
      </div>
    </div>
  );
} 