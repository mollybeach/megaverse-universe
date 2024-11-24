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
        return <div>Loading...</div>;
    }

   // console.log("CurrentMap: currentMapArray", currentMapArray);
    
    return (
        <div className="container mx-auto p-4">
            <div className="max-w-[1200px] mx-auto">
                <div style={{ letterSpacing: '0.5em' }}>
                    {currentMapArray.map((row: RowType, rowIndex: number) => (
                        <div key={rowIndex} className="current-row">
                            <div>
                                {row.map((cell: CellType, cellIndex: number) => {
                                    let displayValue: string;
                                    if (cell === null || cell === "SPACE") {
                                        displayValue = "🌌";
                                    } else if (cell === "POLYANET" || (typeof cell === 'object' && cell !== null && cell.type === 0)) {
                                        displayValue = "🪐";
                                    } else if (cell === "RIGHT_COMETH" || (typeof cell === 'object' && cell !== null && cell.type === 1)) {
                                        displayValue = "☄️";
                                    } else if (cell === "UP_COMETH" || (typeof cell === 'object' && cell !== null && cell.type === 2)) {
                                        displayValue = "🔼";
                                    } else if (cell === "LEFT_COMETH" || (typeof cell === 'object' && cell !== null && cell.type === 3)) {
                                        displayValue = "⬅️";
                                    } else if (cell === "DOWN_COMETH" || (typeof cell === 'object' && cell !== null && cell.type === 4)) {
                                        displayValue = "🔽";
                                    } else if (cell === "WHITE_SOLOON" || (typeof cell === 'object' && cell !== null && cell.type === 5)) {
                                        displayValue = "⚪️";
                                    } else if (cell === "BLUE_SOLOON" || (typeof cell === 'object' && cell !== null && cell.type === 6)) {
                                        displayValue = "🔵";
                                    } else if (cell === "RED_SOLOON" || (typeof cell === 'object' && cell !== null && cell.type === 7)) {
                                        displayValue = "🔴";
                                    } else if (cell === "PURPLE_SOLOON" || (typeof cell === 'object' && cell !== null && cell.type === 8)) {
                                        displayValue = "🟣";
                                    } else {
                                        displayValue = "";
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