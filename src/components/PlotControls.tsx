/**
 * @title Plot Controls
 * @fileoverview Plot controls component
 * @path /components/PlotControls.tsx
 */

import React, { useState } from 'react';
import { CurrentMapType } from '@/types/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiPath } from '@/utils/paths';
import { LoadingCircle } from './LoadingCircle';
import { compareMapWithGoal } from '@/lib/utils/mapComparator';


interface PlotControlsProps {
    phase: number;
    currentMapData: CurrentMapType;
    updateCurrentMap: (newMap: CurrentMapType) => void;
    row: number;
    column: number;
}

export const PlotControls: React.FC<PlotControlsProps> = (props) => {
    const [error, setError] = useState<string | null>(null);

    const addEmoji = async (emojiType: string, row?: number, column?: number) => {
        console.log(`Adding ${emojiType} at`, row ?? props.row, column ?? props.column);
        try {
            const updatedCurrentMapData = { ...props.currentMapData };
            const targetRow = row ?? props.row;
            const targetColumn = column ?? props.column;

            if (updatedCurrentMapData.map.content) {
                if (!Array.isArray(updatedCurrentMapData.map.content[targetRow])) {
                    updatedCurrentMapData.map.content[targetRow] = [];
                }
                updatedCurrentMapData.map.content[targetRow][targetColumn] = emojiType;

                props.updateCurrentMap(updatedCurrentMapData as CurrentMapType);

                const requestBody = {
                    row: targetRow,
                    column: targetColumn,
                    emojiType
                }

                const response = await fetch(getApiPath('current'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                const responseData = await response.json();
                console.log("responseData", responseData);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log(`${emojiType} Successfully Added`);
            }
        } catch (error) {
            console.error(`Error adding ${emojiType}:`, error);
            setError(`Failed to add ${emojiType}.`);
            throw error;
        }
    };

    const handleDeleteEmoji = async ({emojiType}: {emojiType: string}) => {
        console.log("deleteEmoji", props.row, props.column);
        try {
            const updatedCurrentMapData = { ...props.currentMapData };
            if (updatedCurrentMapData.map.content) {
                updatedCurrentMapData.map.content[props.row][props.column] = 'SPACE'; // Replace with SPACE
                props.updateCurrentMap(updatedCurrentMapData as CurrentMapType);
                console.log("updatedCurrentMapData", updatedCurrentMapData);

                const response = await fetch(getApiPath('current'), {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        _id: props.currentMapData.map._id,
                        content: updatedCurrentMapData.map.content,
                        candidateId: props.currentMapData.map.candidateId,
                        phase: props.currentMapData.map.phase,
                        __v: props.currentMapData.map.__v,
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
                console.log("Emoji Successfully Deleted");
            }
        } catch (error) {
            console.error('Error deleting Emoji:', error);
            setError('Failed to delete Emoji.');
        }
    };

    const handleAutoSync = async () => {
        try {
            setError(null);
            
            // Fetch goal map
            const goalResponse = await fetch(getApiPath('goal'));
            const goalData = await goalResponse.json();
            const goalMap = goalData.goal;

            // Get current map
            const currentMap = props.currentMapData.map.content;

            // Compare maps and get differences
            const differences = compareMapWithGoal(currentMap, goalMap);
            console.log('Differences to process:', differences);

            // Process each difference with delay to avoid rate limiting
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

                    await addEmoji(emojiType, diff.row, diff.column);
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    console.error(`Error processing difference:`, error);
                    setError(`Failed to process some changes. Please try again.`);
                }
            }

        } catch (error) {
            console.error('Error in auto-sync:', error);
            setError('Failed to auto-sync with goal map');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-md">
            {error && <div className="text-red-500 text-center">
                {error} <LoadingCircle message="Posting to Metaverse..." error={error} />
            </div>}
            <div className="flex flex-col items-center space-y-4">
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
                    <Button 
                        onClick={() => addEmoji('POLYANET')} 
                        className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200"
                    >
                        Add 🪐
                    </Button>
                    <Button 
                        onClick={() => handleDeleteEmoji({emojiType: 'POLYANET'})} 
                        className="bg-gradient-to-r from-pink-600 to-blue-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200"
                    >
                        Delete Current Emoji
                    </Button>
                </div>
                {props.phase && (
                    <div className="flex space-x-4">
                        <Button onClick={() => addEmoji('WHITE_SOLOON')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                            Add 
                            <span style={{ filter: 'grayscale(100%)' }}>
                                🌕
                            </span>
                        </Button>
                        <Button onClick={() => addEmoji('BLUE_SOLOON')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">Add 
                            <span style={{ filter: 'grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-180deg) saturate(700%) contrast(0.8)' }}>
                                🌕
                            </span>
                        </Button>
                        <Button onClick={() => addEmoji('RED_SOLOON')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">Add 
                            <span style={{ filter: 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)' }}>
                                🌕
                            </span>
                        </Button>
                        <Button onClick={() => addEmoji('PURPLE_SOLOON')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">Add 
                            <span style={{ filter: 'grayscale(100%) brightness(70%) sepia(50%) hue-rotate(-100deg) saturate(500%) contrast(1)' }}>
                                🌕
                            </span>
                        </Button>
                        <Button onClick={() => addEmoji('UP_COMETH')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                            Add
                            <span className='rotate-[48deg] inline-block top-2 right-1 relative'>
                                ☄️
                            </span>
                        </Button>
                        <Button onClick={() => addEmoji('DOWN_COMETH')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                            Add
                            <span className='rotate-[230deg] inline-block right-3 bottom-2 relative'>
                                ☄️
                            </span>
                        </Button>
                        <Button onClick={() => addEmoji('RIGHT_COMETH')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                            Add
                            <span className='rotate-[140deg] inline-block right-3 top-1 relative'>
                                ☄️
                            </span>
                        </Button>

                        <Button onClick={() => addEmoji('LEFT_COMETH')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">
                            Add
                            <span className='rotate-[330deg] inline-block left-1 bottom-1 relative'>
                                ☄️
                            </span>
                        </Button>
                    </div>
                )}
                <Button 
                    onClick={handleAutoSync}
                    className="bg-gradient-to-r from-blue-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200 mt-4"
                >
                    Auto-Sync with Goal Map 🚀
                </Button>
            </div>
        </div>
    );
};

export default PlotControls;
