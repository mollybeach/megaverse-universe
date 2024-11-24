/**
 * @title Plot Controls
 * @fileoverview Plot controls component
 * @path /components/PlotControls.tsx
 */

import React, { useState } from 'react';
import { CurrentMapType } from '@/types/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PlotControlsProps {
    phase: number;
    currentMapData: CurrentMapType;
    updateCurrentMap: (newMap: CurrentMapType) => void;
}

/*
Phase 2 
Polyanets
POST /api/polyanets with arguments 'row' and 'column' for their position in the map
DELETE /api/polyanets with arguments 'row' and 'column' will delete a Polyanet if you made a mistake
Soloons
POST /api/soloons with arguments 'row' and 'column' for their position in the map.
Additionally you should provide a 'color' argument which can be "blue", "red", "purple" or "white"
DELETE /api/soloons with arguments 'row' and 'column' will delete a Polyanet if you made a mistake
Cometh
POST /api/comeths with arguments 'row' and 'column' for their position in the map.
Additionally you should provide a 'direction' argument which can be "up", "down", "right" or "left"
DELETE /api/comeths with arguments 'row' and 'column' will delete a Polyanet if you made a mistake
*/
export const PlotControls: React.FC<PlotControlsProps> = (props) => {
    const [row, setRow] = useState<number>(0);
    const [column, setColumn] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const addEmoji = async (emojiType: string) => {
        console.log(`Adding ${emojiType} at`, row, column);
        try {
            const updatedCurrentMapData = { ...props.currentMapData };
            if (updatedCurrentMapData.map.content) {
                if (!Array.isArray(updatedCurrentMapData.map.content[row])) {
                    updatedCurrentMapData.map.content[row] = [];
                }
                updatedCurrentMapData.map.content[row][column] = emojiType;

                console.log("Updated Content Structure:", JSON.stringify(updatedCurrentMapData.map.content));

                props.updateCurrentMap(updatedCurrentMapData as CurrentMapType);
                console.log("updatedCurrentMapData", JSON.stringify(updatedCurrentMapData));
                const requestBody = {
                    row,
                    column,
                    emojiType
                }

                console.log("Request Body:", JSON.stringify(requestBody));

                const response = await fetch('/api/current', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                const responseData = await response.json();
                console.log("response", responseData);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log(`${emojiType} Successfully Added`);
            }
        } catch (error) {
            console.error(`Error adding ${emojiType}:`, error);
            setError(`Failed to add ${emojiType}.`);
        }
    };

    const handleDeleteEmoji = async ({emojiType}: {emojiType: string}) => {
        console.log("deleteEmoji", row, column);
        try {
            const updatedCurrentMapData = { ...props.currentMapData };
            if (updatedCurrentMapData.map.content) {
                updatedCurrentMapData.map.content[row][column] = 'SPACE'; // Replace with SPACE
                props.updateCurrentMap(updatedCurrentMapData as CurrentMapType);
                console.log("updatedCurrentMapData", updatedCurrentMapData);

                const response = await fetch('/api/current', {
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
                        row,
                        column,
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

    if (error) {
        return <div>Error loading Metaverse</div>;
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-md">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                    <Input
                        type="number"
                        value={row}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setRow(value < 0 ? 0 : value); // Prevent negative values
                        }}
                        placeholder="Row"
                        min={0}
                        max={props.phase === 2 ? 29 : 11}
                        className="w-24 h-10 text-lg border border-gray-300 rounded-md shadow-sm"
                    />
                    <Input
                        type="number"
                        value={column}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setColumn(value < 0 ? 0 : value); // Prevent negative values
                        }}
                        placeholder="Column"
                        min={0}
                        max={props.phase === 2 ? 29 : 11}
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
                        <Button onClick={() => addEmoji('RIGHT_COMETH')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">Add ➡️</Button>
                        <Button onClick={() => addEmoji('UP_COMETH')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">Add 🔼</Button>
                        <Button onClick={() => addEmoji('LEFT_COMETH')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">Add ⬅️</Button>
                        <Button onClick={() => addEmoji('DOWN_COMETH')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">Add 🔽</Button>
                        <Button onClick={() => addEmoji('WHITE_SOLOON')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">Add ⚪️</Button>
                        <Button onClick={() => addEmoji('BLUE_SOLOON')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">Add 🔵</Button>
                        <Button onClick={() => addEmoji('RED_SOLOON')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">Add 🔴</Button>
                        <Button onClick={() => addEmoji('PURPLE_SOLOON')} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200">Add 🟣</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

  