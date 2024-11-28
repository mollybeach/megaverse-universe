/*
* @title: Map
* @path: src/components/Map.tsx
* @description: Component to display the current megaverse map
*/

import React, { useState, useEffect, memo } from 'react';
import { RowType, CellType } from '@/types/types';
import { LoadingCircle } from './LoadingCircle';
import ErrorBoundary from './ErrorBoundary';
import { convertCellToEmoji } from '@/utils/emojiTypeConvertor';

interface MapProps {
    mapArray: CellType[][];
    setRow: (row: number) => void;
    setColumn: (column: number) => void;
}

const Map: React.FC<MapProps> = memo(({ mapArray, setRow, setColumn }: MapProps) => {
    const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
    const [isLocked, setIsLocked] = useState(false);

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
                                    const { emoji, color, rotation } = convertCellToEmoji(cell);
                                    
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
                                                fontSize: 'var(--emoji-size)',
                                                ...(color ? { filter: color } : {})
                                            }} 
                                            className={`
                                                map-cell
                                                emoji-cell
                                                ${rotation || ''}
                                                select-none
                                                ${selectedCell?.row === rowIndex && selectedCell?.col === cellIndex ? 'ring-2 ring-blue-500' : ''}
                                            `}
                                        >                       
                                            {emoji}
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
});

export default Map;
