/**
 * @title Plot Controls
 * @fileoverview Plot controls component
 * @path /components/PlotControls.tsx
 */

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiPath } from '@/utils/paths';
import { LoadingCircle } from './LoadingCircle';
import { compareMapWithGoal } from '@/utils/mapComparator';
import { validateMap } from '@/utils/mapValidation';
import { CellType } from '@/types/types';
import ErrorBoundary from './ErrorBoundary';

interface PlotControlsProps {
    phase: number | null;
    currentMap: CellType[][];
    goalMap: CellType[][];
    updateCurrentMap: (newMap: CellType[][]) => void;
    row: number;
    column: number;
}

export const PlotControls: React.FC<PlotControlsProps> = (props: PlotControlsProps) => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleValidation = () => {
        const { isValid, errors } = validateMap(props.currentMap, props.goalMap);
        
        if (isValid) {
            alert('Congratulations! Your solution matches the goal map! 🎉');
        } else {
            alert(`Solution is not correct yet.\nFound ${errors.length} mismatches.`);
        }
    };

    const addEmoji = async (row: number, column: number, emojiType: string) => {
        try {
            setError(null);
            setSuccess(null);
            
            console.log('Attempting to add emoji:', { row, column, emojiType });

            const response = await fetch('/api/current', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row, column, emojiType })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: errorData
                });
                throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
            }

            // Update the local state immediately
            const updatedMap = [...props.currentMap]; // Create a proper copy
            if (!Array.isArray(updatedMap)) {
                console.error('Current map is not an array:', updatedMap);
                return;
            }
            
            // Ensure we're working with a valid 2D array
            if (updatedMap[row] && Array.isArray(updatedMap[row])) {
                updatedMap[row][column] = emojiType;
                props.updateCurrentMap(updatedMap);
            }

            // If you need to fetch updated data
            const getCurrentMap = await fetch('/api/current', {
                method: 'GET',
                cache: 'no-store'
            });
            
            if (getCurrentMap.ok) {
                const latestMapData = await getCurrentMap.json();
                // Ensure we're getting the correct structure
                if (latestMapData?.map?.content && Array.isArray(latestMapData.map.content)) {
                    props.updateCurrentMap(latestMapData.map.content);
                } else {
                    console.error('Invalid map data structure:', latestMapData);
                }
            }

        } catch (error) {
            console.error('Error in addEmoji:', error);
            setError(error instanceof Error ? error.message : 'Failed to add emoji');
        }
    };

    const handleDeleteEmoji = async ({emojiType}: {emojiType: string}) => {
        console.log("deleteEmoji", props.row, props.column);
        try {
            const updatedMap = props.currentMap.map(row => [...row]);
            updatedMap[props.row][props.column] = 'SPACE';
            props.updateCurrentMap(updatedMap);
            console.log("updatedCurrentMapData", updatedMap);

            const response = await fetch(getApiPath('current'), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    row: props.row,
                    column: props.column,
                    emojiType
                })
            });

            const responseData = await response.json();
            console.log("response", responseData);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setSuccess(`Successfully deleted emoji at position [${props.row}, ${props.column}]`);
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (error) {
            console.error('Error deleting Emoji:', error);
            setError('Failed to delete Emoji.');
        }
    };

    const handleAutoSync = async () => {
        try {
            setError(null);
            
            const currentMap = props.currentMap.map(row => [...row]);
            const differences = compareMapWithGoal(currentMap, props.goalMap as string[][]);
            for (const diff of differences) {
                try {
                    let emojiType = '';
                    
                    if (diff.type === 'POLYANET') {
                        emojiType = 'POLYANET';
                    } else if (diff.type === 'SOLOON') {
                        emojiType = `${diff.color?.toUpperCase()}_SOLOON`;
                    } else if (diff.type === 'COMETH') {
                        emojiType = `${diff.direction?.toUpperCase()}_COMETH`;
                    }

                    await addEmoji(diff.row, diff.column, emojiType);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    setError(`Failed to process some changes. Please try again.`);
                }
            }
        } catch (error) {
            setError('Failed to auto-sync with goal map');
        }
    };
    
    return (
        <ErrorBoundary>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-md">
                {error && <div className="text-red-500 text-center mb-4">
                    {error} <LoadingCircle message="Posting to Metaverse..." error={error} />
                </div>}
                <div className="flex flex-col items-center space-y-4">
                    <div className="text-xl font-bold bg-gradient-to-r text-white text-transparent bg-clip-text">
                        To Set Row & Column:  Hover Over Map
                    </div>
                    <Button 
                        onClick={handleValidation}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-400 text-white hover:shadow-lg mb-6"
                    >
                        Validate Map 🎯
                    </Button>
                    {/* Polyanet controls */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex space-x-4">
                            <Button onClick={() => addEmoji(props.row, props.column, 'POLYANET')} className="w-24 h-10 bg-gradient-to-r from-pink-600 to-blue-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                                Add 🪐
                            </Button>
                            <Button onClick={() => handleDeleteEmoji({emojiType: 'POLYANET'})} className="w-24 h-10 bg-gradient-to-r from-pink-600 to-blue-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                                Delete ❌
                            </Button>
                        </div>
                        <div className="flex space-x-4">
                            <Input
                                type="number"
                                value={props.row}
                                readOnly
                                className="w-24 h-10 text-lg border border-gray-300 rounded-md shadow-sm"
                            />
                            <Input
                                type="number"
                                value={props.column}
                                readOnly
                                className="w-24 h-10 text-lg border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    </div>
                    {/* Soloon buttons */}
                    {props.phase && (
                        <div className="flex flex-col space-y-4">
                            <div className="flex space-x-4">
                                <Button onClick={() => addEmoji(props.row, props.column, 'WHITE_SOLOON')} className="w-24 h-10 bg-gradient-to-r from-pink-400 to-orange-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                                    Add <span style={{ filter: 'grayscale(100%)' }} className='relative left-1'>🌕</span>
                                </Button>
                                <Button onClick={() => addEmoji(props.row, props.column, 'BLUE_SOLOON')} className="w-24 h-10 bg-gradient-to-r from-pink-400 to-orange-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                                    Add <span style={{ filter: 'grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-180deg) saturate(700%) contrast(0.8)' }} className='relative left-1'>🌕</span>
                                </Button>
                            </div>
                            <div className="flex space-x-4">
                                <Button onClick={() => addEmoji(props.row, props.column, 'RED_SOLOON')} className="w-24 h-10 bg-gradient-to-r from-pink-400 to-orange-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                                    Add <span style={{ filter: 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)' }} className='relative left-1'>🌕</span>
                                </Button>
                                <Button onClick={() => addEmoji(props.row, props.column, 'PURPLE_SOLOON')} className="w-24 h-10 bg-gradient-to-r from-pink-400 to-orange-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                                    Add <span style={{ filter: 'grayscale(100%) brightness(70%) sepia(50%) hue-rotate(-100deg) saturate(500%) contrast(1)' }} className='relative left-1'>🌕</span>
                                </Button>
                            </div>
                        </div>
                    )}
                    {/* Cometh buttons */}
                    {props.phase && (
                        <div className="flex flex-col space-y-4">
                            <div className="flex space-x-4">
                                <Button onClick={() => addEmoji(props.row, props.column, 'UP_COMETH')} className="w-24 bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                                    Add
                                    <span className='rotate-[48deg] inline-block relative left-1'>
                                        ☄️
                                    </span>
                                </Button>
                                <Button onClick={() => addEmoji(props.row, props.column, 'DOWN_COMETH')} className="w-24 bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                                    Add
                                    <span className='rotate-[230deg] inline-block left-1.5 relative'>
                                        ☄️
                                    </span>
                                </Button>
                            </div>
                            <div className="flex space-x-4">
                                <Button onClick={() => addEmoji(props.row, props.column, 'RIGHT_COMETH')} className="w-24 bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                                    Add
                                    <span className='rotate-[140deg] inline-block left-1.5 relative'>
                                        ☄️
                                    </span>
                                </Button>
                                <Button onClick={() => addEmoji(props.row, props.column, 'LEFT_COMETH')} className="w-24 bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                                    Add
                                    <span className='rotate-[330deg] inline-block left-1.5 relative'>
                                        ☄️
                                    </span>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
        
                <Button 
                    onClick={handleAutoSync}
                    className="bg-gradient-to-r from-blue-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200 mt-4"
                >
                    Auto-Sync with Goal Map 🚀
                </Button>
                {success && <div className="text-green-500 text-center mb-4 z-index-10">
                    {success}
                </div>}
            </div>
        </ErrorBoundary>
    );
};

export default PlotControls;
