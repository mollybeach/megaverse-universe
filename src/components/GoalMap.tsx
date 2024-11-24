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
                                } else if (cell === "POLYANET") {
                                    displayValue = "🪐"; // Render planet emoji
                                } else if (cell === "RIGHT_COMETH") {
                                    displayValue = "☄️"; // Render right cometh emoji
                                } else if (cell === "UP_COMETH") {
                                    displayValue = "🔼"; // Render up cometh emoji
                                } else if (cell === "LEFT_COMETH") {
                                    displayValue = "⬅️"; // Render left cometh emoji
                                } else if (cell === "DOWN_COMETH") {
                                    displayValue = "🔽"; // Render down cometh emoji
                                } else if (cell === "WHITE_SOLOON") {
                                    displayValue = "⚪️"; // Render white soloons emoji
                                } else if (cell === "BLUE_SOLOON") {
                                    displayValue = "🔵"; // Render blue soloons emoji
                                } else if (cell === "RED_SOLOON") {
                                    displayValue = "🔴"; // Render red soloons emoji
                                } else if (cell === "PURPLE_SOLOON") {
                                    displayValue = "🟣"; // Render purple soloons emoji
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