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
        lg: 'text-9xl'
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            {message && (
                <div className="text-center text-2xl font-semibold bg-gradient-to-r from-yellow-200 to-orange-500 text-transparent bg-clip-text drop-shadow-lg">
                    {message}
                </div>
            )}
            <div className={`inline-block animate-spin ${sizeClasses[size]} mt-2`}>
                🌞 
            </div>
        </div>
    );
};

export default SunLoadingCircle; 