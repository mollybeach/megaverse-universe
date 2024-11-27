/*
* @title: Map
* @path: src/components/Map.tsx
* @description: Component to display the current megaverse map
*/

import React, { useState, useEffect } from 'react';
import { RowType, CellType } from '@/types/types';
import { LoadingCircle } from './LoadingCircle';
import ErrorBoundary from './ErrorBoundary';

interface MapProps {
    mapArray: CellType[][];
    setRow: (row: number) => void;
    setColumn: (column: number) => void;
}

const Map: React.FC<MapProps> = ({ mapArray, setRow, setColumn }: MapProps) => {
    const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
    const [isLocked, setIsLocked] = useState(false);

    // Add global click listener to reset state
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.map-cell')) {
                setSelectedCell(null);
                setIsLocked(false);
                setRow(0);
                setColumn(0);
            }
        };

        document.addEventListener('click', handleGlobalClick);
        return () => document.removeEventListener('click', handleGlobalClick);
    }, [setRow, setColumn]);

    const handleCellInteraction = (rowIndex: number, cellIndex: number, isClick: boolean) => {
        if (isClick) {
            setSelectedCell({ row: rowIndex, col: cellIndex });
            setIsLocked(true);
            setRow(rowIndex);
            setColumn(cellIndex);
        } else if (!isLocked) {
            setRow(rowIndex);
            setColumn(cellIndex);
        }
    };

    const handleMouseLeave = () => {
        if (!isLocked) {
            setRow(0);
            setColumn(0);
        }
    };

    if (!mapArray || mapArray.length === 0) {
        return <LoadingCircle message="Loading Megaverse..." />;
    }

    return (
        <ErrorBoundary>
            <div 
                className="flex justify-center items-center w-full"
                onMouseLeave={handleMouseLeave}
            >
                <div className="inline-block">
                    <div className="grid grid-cols-1" style={{ 
                        letterSpacing: '0.5em',
                        width: 'fit-content',
                        margin: '0 auto'
                    }}>
                        {mapArray.map((row: RowType, rowIndex: number) => (
                            <div 
                                key={rowIndex} 
                                className="flex flex-nowrap justify-center" 
                                style={{ whiteSpace: 'nowrap' }}
                            >
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCellInteraction(rowIndex, cellIndex, true);
                                            }}
                                            onMouseEnter={() => handleCellInteraction(rowIndex, cellIndex, false)}
                                            key={cellIndex} 
                                            style={{
                                                cursor: 'pointer',
                                                display: 'inline-block',
                                                width: '1.5em',
                                                textAlign: 'center',
                                                ...(displayColor === 'none' && displayRotation === 'none' ? {} : 
                                                    displayColor === 'white' ? { filter: 'grayscale(100%)' } :
                                                    displayColor === 'blue' ? { filter: 'grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-180deg) saturate(700%) contrast(0.8' } :
                                                    displayColor === 'red' ? {filter: 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)'} :
                                                    displayColor === 'purple' ? {filter: 'grayscale(100%) brightness(70%) sepia(50%) hue-rotate(-100deg) saturate(500%) contrast(1)' } :
                                                    {}
                                                )
                                            }} 
                                            className={`
                                                map-cell
                                                ${displayRotation === 'up' ? 'rotate-[48deg] relative top-1 right-0' :
                                                displayRotation === 'down' ? 'rotate-[230deg] relative right-1 bottom-1' :
                                                displayRotation === 'right' ? 'rotate-[140deg] relative right-2 top-1' :
                                                displayRotation === 'left' ? 'rotate-[330deg] relative left-0 bottom-1' :
                                                ''}
                                                select-none
                                                ${selectedCell?.row === rowIndex && selectedCell?.col === cellIndex ? 'ring-2 ring-blue-500' : ''}
                                            `}
                                        >                       
                                            {displayValue}
                                        </span>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Map;

