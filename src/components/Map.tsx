/*
* @title: Map
* @path: src/components/Map.tsx
* @description: Component to display the current megaverse map
*/

import React from 'react';
import { RowType, CellType } from '@/types/types';
import { LoadingCircle } from './LoadingCircle';

interface MapProps {
    mapArray: CellType[][];
    setRow: (row: number) => void;
    setColumn: (column: number) => void;
}

const Map: React.FC<MapProps> = ({ mapArray, setRow, setColumn }: MapProps) => {

    const handleEmojiClick = (rowIndex: number, cellIndex: number) => {
        setRow(rowIndex);
        setColumn(cellIndex);
    };

    if (!mapArray || mapArray.length === 0) {
        return <LoadingCircle message="Loading Megaverse..." />;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-[1200px] mx-auto">
                <div style={{ letterSpacing: '0.5em' }}>
                    {mapArray.map((row: RowType, rowIndex: number) => (
                        <div key={rowIndex} className="current-row">
                            <div>
                                {row.map((cell: CellType, cellIndex: number) => {
                                    let displayValue: string;
                                    let displayColor = "none";
                                    let displayRotation = "none";

                                    if (cell === null || cell === "SPACE") {
                                        displayValue = "🌌";
                                    } else if (cell === "POLYANET" || (typeof cell === 'object' && cell !== null && cell.type === 0)) {
                                        displayValue = "🪐";
                                    } else if (cell === "WHITE_SOLOON" || (typeof cell === 'object' && cell !== null && cell.type === 1 && 'color' in cell && cell.color === "white")) {
                                        displayValue = "🌕";
                                        displayColor = "white";
                                    } else if (cell === "BLUE_SOLOON" || (typeof cell === 'object' && cell !== null && cell.type === 1 && 'color' in cell && cell.color === "blue")) {
                                        displayValue = "🌕";
                                        displayColor = "blue";
                                    } else if (cell === "RED_SOLOON" || (typeof cell === 'object' && cell !== null && cell.type === 1 && 'color' in cell && cell.color === "red")) {
                                        displayValue = "🌕";
                                        displayColor = "red";
                                    } else if (cell === "PURPLE_SOLOON" || (typeof cell === 'object' && cell !== null && cell.type === 1 && 'color' in cell && cell.color === "purple")) {
                                        displayValue = "🌕";
                                        displayColor = "purple";
                                    } else if (cell === "UP_COMETH" || (typeof cell === 'object' && cell !== null && cell.type === 2 && 'direction' in cell && cell.direction === "up")) {
                                        displayValue = "☄️";
                                        displayRotation = "up" 
                                    } else if (cell === "DOWN_COMETH" || (typeof cell === 'object' && cell !== null && cell.type === 2 && 'direction' in cell && cell.direction === "down")) {
                                        displayValue = "☄️";
                                        displayRotation = "down" 
                                    } else if (cell === "RIGHT_COMETH" || (typeof cell === 'object' && cell !== null && cell.type === 2 && 'direction' in cell && cell.direction === "right")) {
                                        displayValue = "☄️";
                                        displayRotation = "right"; 
                                    } else if (cell === "LEFT_COMETH" || (typeof cell === 'object' && cell !== null && cell.type === 2 && 'direction' in cell && cell.direction === "left")) {
                                        displayValue = "☄️";
                                        displayRotation = "left"; 

                                    } else {
                                        displayValue = "🌌";
                                    }
                                    return (
                                        <span   
                                                onClick={() => handleEmojiClick(rowIndex, cellIndex)} 
                                                key={cellIndex} 
                                                style={{
                                                    cursor: 'pointer',
                                                    ...(displayColor === 'none' && displayRotation === 'none' ? {} : 
                                                        displayColor === 'white' ? { filter: 'grayscale(100%)' } :
                                                        displayColor === 'blue' ? { filter: 'grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-180deg) saturate(700%) contrast(0.8' } :
                                                        displayColor === 'red' ? {filter: 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)'} :
                                                        displayColor === 'purple' ? {filter: 'grayscale(100%) brightness(70%) sepia(50%) hue-rotate(-100deg) saturate(500%) contrast(1)' } :
                                                        {}
                                                    )
                                                }} 
                                                className={
                                                    displayRotation === 'up' ? 'rotate-[48deg] inline-block top-1 right-0 relative' :
                                                    displayRotation === 'down' ? 'rotate-[230deg] inline-block right-1 bottom-1 relative' :
                                                    displayRotation === 'right' ? 'rotate-[140deg] inline-block right-2 top-1 relative' :
                                                    displayRotation === 'left' ? 'rotate-[330deg] inline-block left-0bottom-1 relative' :
                                                    ''
                                                }
                                        >                       
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

export default Map;

