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
      <div className="flex flex-col justify-center items-center relative" style={{ height: '800px', width: '800px' }}>
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
                transform: `rotate(${(index * 30)}deg) translate(300px) rotate(-${(index * 30)}deg)`,
                fontSize: '5rem',
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))',
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
        <div className="text-center text-4xl font-semibold bg-gradient-to-r from-yellow-200 to-orange-500 text-transparent bg-clip-text drop-shadow-lg max-w-[400px] break-words">
          {props.message}
        </div>
        {props.error && (
          <div className="absolute bottom-20 text-center text-xl font-semibold bg-gradient-to-r from-red-500 to-red-900 text-transparent bg-clip-text drop-shadow-lg max-w-[300px] break-words mx-auto px-4">
            {props.error}
          </div>
        )}
      </div>
    </div>
  );
}
