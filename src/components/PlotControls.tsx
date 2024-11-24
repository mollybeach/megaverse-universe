/**
 * @title Plot Controls
 * @fileoverview Plot controls component
 * @path /components/PlotControls.tsx
 */

import React, { useState, useEffect } from 'react';
import { CurrentMapType } from '@/types/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { NextResponse } from 'next/server';


interface PlotControlsProps {
    currentMapData: CurrentMapType;
    updateCurrentMap: (newMap: CurrentMapType) => void;
}


export const PlotControls: React.FC<PlotControlsProps> = (props) => {
    const [row, setRow] = useState<number>(0);
    const [column, setColumn] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const addPolyanet = async (row: number, column: number) => {
        console.log("addPolyanet", row, column);
        try {
            const updatedCurrentMapData = { ...props.currentMapData };
            if (updatedCurrentMapData.map.content) {
                updatedCurrentMapData.map.content[row][column] = 'POLYANET';
                props.updateCurrentMap(updatedCurrentMapData as CurrentMapType);
                console.log("updatedCurrentMapData", updatedCurrentMapData);
                // Log the data being sent
                console.log("Sending request to /api/current with data:", { 
                    _id: props.currentMapData.map._id,
                    content: updatedCurrentMapData.map.content,
                    candidateId: props.currentMapData.map.candidateId,
                    phase: props.currentMapData.map.phase,
                    __v: props.currentMapData.map.__v,
                    row,
                    column
                });

                const response = await fetch('/api/current', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        _id: props.currentMapData.map._id, // Include _id
                        content: updatedCurrentMapData.map.content, // Include updated content
                        candidateId: props.currentMapData.map.candidateId, // Include candidateId
                        phase: props.currentMapData.map.phase, // Include phase
                        __v: props.currentMapData.map.__v, // Include __v
                        row, // Include row
                        column // Include column
                    })
                });

                const responseData = await response.json(); // Parse the response as JSON
                console.log("response", responseData); // Log the response data

                NextResponse.json(responseData, { status: 200 });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log("Polyanet Successfully Added");
            }
        } catch (error) {
            console.error('Error adding Polyanet:', error);
            setError('Failed to add Polyanet.');
        }
    };

    const handleDeletePolyanet = async (row: number, column: number) => {
        console.log("deletePolyanet", row, column);
        try {
            const updatedCurrentMapData = { ...props.currentMapData };
            if (updatedCurrentMapData.map.content) {
                updatedCurrentMapData.map.content[row][column] = 'SPACE';
                props.updateCurrentMap(updatedCurrentMapData as CurrentMapType);
                console.log("updatedCurrentMapData", updatedCurrentMapData);
                // Log the data being sent
                console.log("Sending request to /api/current with data:", { 
                    _id: props.currentMapData.map._id,
                    content: updatedCurrentMapData.map.content,
                    candidateId: props.currentMapData.map.candidateId,
                    phase: props.currentMapData.map.phase,
                    __v: props.currentMapData.map.__v,
                    row,
                    column
                });

                const response = await fetch('/api/current', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        _id: props.currentMapData.map._id, // Include _id
                        content: updatedCurrentMapData.map.content, // Include updated content
                        candidateId: props.currentMapData.map.candidateId, // Include candidateId
                        phase: props.currentMapData.map.phase, // Include phase
                        __v: props.currentMapData.map.__v, // Include __v
                        row, // Include row
                        column // Include column
                    })
                });

                const responseData = await response.json(); // Parse the response as JSON
                console.log("response", responseData); // Log the response data
                NextResponse.json(responseData, { status: 200 });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log("Polyanet Successfully Added");
            }
        } catch (error) {
            console.error('Error adding Polyanet:', error);
            setError('Failed to add Polyanet.');
        }
    };

    if(error) {
        return <div>Error loading Metaverse</div>
    }
    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-md">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                <div className="flex space-x-4 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"> 
                    Enter Index Values to Add or Delete Polyanets: 
                    </div>
                <Input
                        type="number"
                        value={row}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setRow(value < 0 ? 0 : value); // Prevent negative values
                        }}
                        placeholder="Row"
                        min={0} // Set minimum value to 0
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
                        min={0} // Set minimum value to 0
                        className="w-24 h-10 text-lg border border-gray-300 rounded-md shadow-sm"
                    />
                    <Button 
                        onClick={() => addPolyanet(row, column)} 
                        className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200"
                    >
                        Add 🪐
                    </Button>
                    <Button 
                        onClick={() => handleDeletePolyanet(row, column)} 
                        className="bg-gradient-to-r from-pink-600 to-blue-400 text-white hover:shadow-lg transition-shadow transform hover:scale-105 active:scale-95 active:shadow-inner transition-transform duration-200"
                    >
                        Delete 🪐
                    </Button>
                </div>
            </div>
        </div>
    );
};

  