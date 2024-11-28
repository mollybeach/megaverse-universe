/*
 * @title: Plot Controls
 * @path: src/components/PlotControls.tsx
 * @description: Plot controls component
 */

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingCircle } from './LoadingCircle';
import { compareMapWithGoal } from '@/utils/mapComparator';
import { validateMap } from '@/utils/mapValidation';
import ErrorBoundary from './ErrorBoundary';
import SunLoadingCircle from './SunLoadingCircle';
import { getSpaceErrorMessage } from '@/utils/spaceErrorMessage';
import { useMegaverseMaps } from '@/hooks/useMegaverseMaps';

interface PlotControlsProps {
    phase: number | null;
    row: number;
    column: number;
}

interface SuccessMessage {
    id: number;
    message: string;
    timestamp: number;
}

export const PlotControls: React.FC<PlotControlsProps> = (props: PlotControlsProps) => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [syncMessages, setSyncMessages] = useState<SuccessMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        currentMapArray,
        goalMapArray,
        setCurrentMapArray,
        fetchCurrentMap
    } = useMegaverseMaps();

    const handleValidation = () => {
        const { isValid, errors } = validateMap(currentMapArray, goalMapArray);
        
        if (isValid) {
            alert('Congratulations! Your solution matches the goal map! 🎉');
        } else {
            alert(`Solution is not correct yet.\nFound ${errors.length} mismatches.`);
        }
    };

    const addEmoji = async (row: number, column: number, emojiType: string) => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/current', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row, column, emojiType })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const newMap = data.map.content.map((row: any[]) => [...row]);
            setCurrentMapArray(newMap);
            await fetchCurrentMap();

            setSuccess(`Successfully added ${emojiType} at position [${row}, ${column}]`);
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error in addEmoji:', error);
            setError(getSpaceErrorMessage('add'));
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    };

    const handleDeleteEmoji = async ({emojiType, row = props.row, column = props.column}: {
        emojiType: string;
        row?: number;
        column?: number;
    }) => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);
            
            const response = await fetch('/api/current', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    row,
                    column,
                    emojiType
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCurrentMapArray([...data.map.content]);
            await fetchCurrentMap();
            setSuccess(`Successfully deleted item at position [${row}, ${column}]`);
            setTimeout(() => setSuccess(null), 3000);

        } catch (error) {
            console.error('Error deleting Emoji:', error);
            setError(getSpaceErrorMessage('delete'));
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000); 
        }
    };

    const handleAutoSync = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setSyncMessages([]);
            
            const mapCopy = currentMapArray.map(row => [...row]);
            const differences = compareMapWithGoal(mapCopy, goalMapArray as string[][]);
            
            for (const diff of differences) {
                try {
                    const goalCell = goalMapArray[diff.row][diff.column];
                    
                    if (goalCell === 'SPACE') {
                        await handleDeleteEmoji({ 
                            emojiType: 'POLYANET',
                            row: diff.row,
                            column: diff.column
                        });
                        setSyncMessages(prev => [{
                            id: Date.now(),
                            message: `Deleted POLYANET at position [${diff.row}, ${diff.column}]`,
                            timestamp: Date.now()
                        }, ...prev]);
                    } else {
                        await addEmoji(diff.row, diff.column, diff.emojiType);
                        setSyncMessages(prev => [{
                            id: Date.now(),
                            message: `Added ${diff.emojiType} at position [${diff.row}, ${diff.column}]`,
                            timestamp: Date.now()
                        }, ...prev]);
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    setError(`Failed to process some changes. Please try again.`);
                }
            }
        } catch (error) {
            setError(getSpaceErrorMessage('sync'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetToVoid = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setSyncMessages([]);

            // Get all non-SPACE cells from current map
            const nonSpaceCells = [];
            for (let row = 0; row < currentMapArray.length; row++) {
                for (let col = 0; col < currentMapArray[row].length; col++) {
                    if (currentMapArray[row][col] !== 'SPACE') {
                        nonSpaceCells.push({ row, col });
                    }
                }
            }

            // Delete all cells
            for (const cell of nonSpaceCells) {
                await handleDeleteEmoji({
                    emojiType: 'POLYANET', // We can use POLYANET as it will delete any type
                    row: cell.row,
                    column: cell.col
                });
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            setSuccess('Universe reset to pre-existence state 🌌');
        } catch (error) {
            setError('Failed to reset the universe');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <ErrorBoundary>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-md">
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
                                        ️
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
                <Button 
                    onClick={handleResetToVoid}
                    className="bg-gradient-to-r from-blue-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200 mt-4"
                >
                    Reset to Cosmic Void 🌌
                </Button>
                <div className="text-center mt-4">
                    {isLoading ? (
                        <SunLoadingCircle size="lg" message={error || "Loading..."} />
                    ) : success ? (
                        <div className="text-green-500 font-semibold">
                            {success}
                        </div>
                    ) : syncMessages.length > 0 ? (
                        <div className="flex flex-col space-y-2 max-h-40 overflow-y-auto">
                            {syncMessages.map((msg) => (
                                <div 
                                    key={msg.id}
                                    className="text-green-500 font-semibold animate-fade-in"
                                >
                                    {msg.message}
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
                {error && (
                    <div className="text-red-500 text-center mb-4">
                        {error} <LoadingCircle message={error} /> 
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default PlotControls;