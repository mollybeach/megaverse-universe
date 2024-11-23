import Image from "next/image";
import { Poppins } from "next/font/google";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export function Hero() {
  const [moons, setMoons] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0); // State to track rotation angle

  useEffect(() => {
    // Create an array of moon emojis with 16 emojis
    const moonArray = [
      '🪐', '🌙', '🌘', '💫', '🌕', '🪐', 
      '🌒', '🌙', '🪐', '🌖', '🌑', '💫', 
      '✨', '🌗', '🪐', '🌕'
    ];
    setMoons(moonArray);

    // Set interval to update rotation
    const interval = setInterval(() => {
      setRotation((prevRotation) => prevRotation - 1); // Decrement rotation angle for reverse rotation
    }, 50); // Adjust speed of rotation (lower is faster)

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative py-6 border border-yellow-500 rounded-xl shadow-lg">
      <div className="inset-0 bg-gradient-to-r from-blue-900/10 to-yellow-500/10 rounded-xl blur-3xl -z-10" />
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
      
          
          {/* Centered Circle of Moons */}
          <div className="relative flex justify-center items-center" style={{ height: '400px', width: '400px', marginTop: '40px' }}>
            <div
              className="absolute"
              style={{
                transform: `rotate(${rotation}deg)`, // Apply rotation
                transition: 'transform 0.1s linear', // Smooth transition
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {moons.map((moon, index) => (
                <span
                  key={index}
                  className="absolute"
                  style={{
                    transform: `rotate(${(index * 22.5)}deg) translate(200px) rotate(-${(index * 22.5)}deg)`, // Adjust rotation for 16 emojis
                    fontSize: '3rem', // Adjust size as needed for larger moons
                  }}
                >
                  {moon}
                </span>
              ))}
            </div>

            {/* Logo in the center */}
            <div className="relative z-10 bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full shadow-md">
              <div className="bg-white dark:bg-slate-950 rounded-full p-1">
                <Image 
                  src="https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1731722293/portfolio/moon_cb2xvd.png"
                  alt="Moon Logo"
                  width={100}
                  height={100}
                  className="rounded-full transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-4"> {/* Flex container for title */}
            <h1 className={`text-4xl font-extrabold bg-gradient-to-r from-yellow-200 to-orange-500
                            text-transparent bg-clip-text ${poppins.className}`}>
              MegaverseNET
            </h1>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A React-based application that solves Crossmint&apos;s coding challenge to mint a new Megaverse into existence. Using a RESTful API, the app creates an X-shaped pattern of            
            <span className="font-medium text-blue-600 dark:text-blue-400"> 🪐 POLYanets (CsA)</span>, in a 2D astral grid, showcasing automation, clean coding practices, and resilience.
            <span className="font-medium text-yellow-600 dark:text-yellow-400"> </span>
            <Link href="/megaverse">
              <span className="inline-flex items-center justify-center h-16 w-48 bg-transparent rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                  Play the Game! ✨
                </span>
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
