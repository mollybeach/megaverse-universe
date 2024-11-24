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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GoalMap;