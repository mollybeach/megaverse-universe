'use client';

import React from 'react';

interface SunLoadingCircleProps {
    size: 'sm' | 'md' | 'lg';
    message?: string;
}

export const SunLoadingCircle: React.FC<SunLoadingCircleProps> = ({ size = 'sm', message }) => {
    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl'
    };

    return (
        <div className={`inline-block animate-spin ${sizeClasses[size]}`}>
            🌞 {message && <span className="ml-2">{message}</span>}
        </div>
    );
};

export default SunLoadingCircle; 