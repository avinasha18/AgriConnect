// src/components/ui/badge.jsx
import React from 'react';

export const Badge = ({ variant = 'default', className, ...props }) => {
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
    const variantClasses = {
        default: 'bg-blue-100 text-blue-800',
        outline: 'border border-current',
    };

    return (
        <span
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        />
    );
};