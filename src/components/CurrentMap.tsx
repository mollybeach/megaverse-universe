/*
* @title: CurrentMap
* @path: src/components/CurrentMap.tsx
* @description: Component to display the current megaverse map
*/

import React from 'react';
import { CurrentMapType, RowType, CellType } from '@/types/types';

interface CurrentMapProps {
    currentMapData: CurrentMapType;
}

const CurrentMap: React.FC<CurrentMapProps> = ({ currentMapData }) => {
    const currentMapArray = currentMapData?.map.content;

    if (!currentMapArray || currentMapArray.length === 0) {
        return <div>Loading...</div>; // Show loading state
    }

    console.log("CurrentMap: currentMapArray", currentMapArray);
    
    return (
        <div className="container mx-auto p-4">
            <div className="max-w-[1200px] mx-auto">
                <div style={{ letterSpacing: '0.5em' }}>
                    {currentMapArray.map((row: RowType, rowIndex: number) => (
                        <div key={rowIndex} className="current-row">
                            <div>
                                {row.map((cell: CellType, cellIndex: number) => {
                                    // Determine the display value based on the cell type
                                    let displayValue: string;

                                    if (cell === null || cell === "SPACE") {
                                        displayValue = "🌌"; // Render space emoji
                                    } else if (cell === "POLYANET" || (typeof cell === 'object' && cell.type === 0)) {
                                        displayValue = "🪐"; // Render planet emoji
                                    } else {
                                        displayValue = ""; // Handle other cases (if needed)
                                    }

                                    return (
                                        <span key={cellIndex}>
                                            {displayValue}
                                        </span>
                                    );
                                })}
                            </div>
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