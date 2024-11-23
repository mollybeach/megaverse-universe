/*
* @title: CurrentMap
* @path: src/components/CurrentMap.tsx
* @description: Component to display the current megaverse map
*/

import React from 'react';
import { CurrentMapType, RowType, CellType } from '@/types/types';

interface CurrentMapProps {
        currentMapData : CurrentMapType;
}

const CurrentMap: React.FC<CurrentMapProps> = ({ currentMapData }) => {
    return (
        <div className="container mx-auto p-4">
            <div className="max-w-[1200px] mx-auto">
                <div style={{ letterSpacing: '0.5em' }}>
                    {currentMapData?.currentMap.map((row: RowType, rowIndex: number) => (
                         <div key={rowIndex} className="current-row">
                            {row.map((cell: CellType, cellIndex: number) => (
                                <span key={cellIndex}>
                                    {cell === "SPACE" ? "🌌" : cell === "POLYANET" ? "🪐" : cell} 
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="mt-5">
                    <button className="bg-cyan-400 p-3 rounded text-white">Validate solution</button>
                </div>
            </div>
        </div>
    );
};

export default CurrentMap;