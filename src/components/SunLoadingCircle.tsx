'use client';

import React from 'react';

interface SunLoadingCircleProps {
    size: 'sm' | 'md' | 'lg';
    message: string;
}

export const SunLoadingCircle: React.FC<SunLoadingCircleProps> = (props) => {
    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl'
    };

    return (
        <div className={`inline-block animate-spin ${sizeClasses[props.size]}`}>
            <span className="">{props.message}</span>
            🌞
        </div>
    );
};

export default SunLoadingCircle; 