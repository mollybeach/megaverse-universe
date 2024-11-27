import React, { useEffect, useState } from 'react';

interface LoadingCircleProps {
  message: string;
  error?: string | null;
}
export function LoadingCircle(props: LoadingCircleProps) {
  const [rotation, setRotation] = useState(0);
  const [loadingEmojis] = useState([
    '🪐', '🌙', '🌘', '💫', '🌕', '🪐', 
    '🌒', '🌙', '🪐', '🌖', '🌑', '💫'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prevRotation: number) => prevRotation - 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm z-50">
      <div className="flex flex-col justify-center items-center relative" style={{ height: '500px', width: '500px' }}>
        <div
          className="absolute inset-0"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.1s linear',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {loadingEmojis.map((emoji: string, index: number) => (
            <span
              key={index}
              className="absolute"
              style={{
                transform: `rotate(${(index * 30)}deg) translate(200px) rotate(-${(index * 30)}deg)`,
                fontSize: '3rem',
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
        <div className="text-center text-2xl font-semibold bg-gradient-to-r from-yellow-200 to-orange-500 text-transparent bg-clip-text">
          {props.message}
        </div>
        {props.error && (
          <div className="absolute bottom-0 text-center text-m font-semibold bg-gradient-to-r from-red-500 to-red-900 text-transparent bg-clip-text">
            {props.error}
          </div>
        )}
      </div>
    </div>
  );
}
