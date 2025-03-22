import React, { ReactNode } from 'react';
import Link from 'next/link';

interface ActionButton {
  label: string;
  href?: string;
  onClick?: (...args: any[]) => void;
  isPrimary?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ActionButton[];
  children?: ReactNode;
}

export default function PageHeader({ 
  title, 
  description, 
  actions = [],
  children 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-hubspot-blue-dark">{title}</h1>
        {description && (
          <p className="text-hubspot-gray-600 text-sm">{description}</p>
        )}
        {children}
      </div>
      
      {actions.length > 0 && (
        <div className="flex gap-3">
          {actions.map((action, index) => {
            const buttonClass = action.isPrimary 
              ? "btn-hubspot text-sm flex items-center gap-1" 
              : "btn-hubspot-secondary text-sm flex items-center gap-1";
              
            if (action.href) {
              return (
                <Link 
                  key={index}
                  href={action.href}
                  className={buttonClass}
                >
                  {action.icon}
                  {action.label}
                </Link>
              );
            }
            
            return (
              <button 
                key={index}
                onClick={action.onClick}
                className={buttonClass}
                disabled={action.disabled || action.isLoading}
                type={action.type || 'button'}
              >
                {action.isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{action.label}</span>
                  </>
                ) : (
                  <>
                    {action.icon}
                    <span>{action.label}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
} 