/*
* @title: GoalMap
* @path: src/components/GoalMap.tsx
* @description: Component to display the current megaverse map
*/

import React from 'react';
import { RowType, CellType, GoalMapType } from '@/types/types';

interface GoalMapProps {
        goalMapData: GoalMapType;       
}

const GoalMap: React.FC<GoalMapProps> = ({ goalMapData }) => {
    return (
        <div className="container mx-auto p-4">
            <div className="max-w-[1200px] mx-auto">
                <div style={{ letterSpacing: '0.5em' }}>
                    {goalMapData?.goal.map((row: RowType, rowIndex: number) => (
                         <div key={rowIndex} className="current-row">
                            {row.map((cell: CellType, cellIndex: number) => ( 
                                <span key={cellIndex}>
                                    {cell === "SPACE" ? "🌌" : cell === "POLYANET" ? "🪐" : cell} 
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GoalMap;