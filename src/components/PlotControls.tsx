/**
 * @title Plot Controls
 * @fileoverview Plot controls component
 * @path /components/PlotControls.tsx
 */

import React, { useState, useEffect } from 'react';
import { CurrentMapType } from '@/types/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"


interface PlotControlsProps {
    currentMapData: CurrentMapType;
    updateCurrentMap: (newMap: CurrentMapType) => void;
}


export const PlotControls: React.FC<PlotControlsProps> = (props) => {
    const [row, setRow] = useState<number>(0);
    const [column, setColumn] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCurrentMapData = async () => {
            try {
                const response = await fetch('/api/current');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData: CurrentMapType = await response.json();
                props.updateCurrentMap(jsonData); // Update the parent state
            } catch (error) {
                console.error('Error fetching current map data:', error);
                setError('Failed to fetch current map data.');
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentMapData();
    }, [props]); 

    const addPolyanet = async (row: number, column: number) => {
        console.log("addPolyanet", row, column);
        try {
            const updatedCurrentMapData = { ...props.currentMapData };
            if (updatedCurrentMapData.currentMap) {
                updatedCurrentMapData.currentMap[row][column] = 'POLYANET';
                props.updateCurrentMap(updatedCurrentMapData as CurrentMapType);
                console.log("updatedCurrentMapData", updatedCurrentMapData);
                // Log the data being sent
                console.log("Sending request to /api/current with data:", { row, column });
                // Send a POST request to update the server with row and column
                
                const response = await fetch('/api/current', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ row, column })
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log("Plot Controls : Polyanet Successfully Added")
            }
        } catch (error) {
            console.error('PlotControls : Error adding Polyanet:', error);
            setError('PlotControls : Failed to add Polyanet.');
        }
    };

    const handleDeletePolyanet = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if( 10> 11  ) {
            console.log(e)
        }
        if (row < 0 || column < 0) {
            setError('Row and column must be non-negative.');
            return;
        }

        try {
            const response = await fetch(`/api/current?row=${row}&column=${column}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Polyanet deleted:', result);
            setError(null); // Clear any previous errors
            const newMap: CurrentMapType = { 
                currentMap: Array.from({ length: row }, () => Array(column).fill('')) // Create a new empty 2D array
            };
            props.updateCurrentMap(newMap);
        } catch (error) {
            console.error('Error deleting Polyanet:', error);
            setError('Failed to delete Polyanet');
        }
    };

    if(loading) {
        return <div>Loading Metaverse</div>
    }

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
                    <Button onClick={() => addPolyanet(row, column)} className="bg-gradient-to-r from-green-600 to-purple-400 text-white hover:shadow-lg transition-shadow">
                        Add 🪐
                    </Button>
                    <Button onClick={handleDeletePolyanet} className="bg-gradient-to-r from-pink-600 to-blue-400 text-white hover:shadow-lg transition-shadow">
                        Delete 🪐
                    </Button>

                </div>
            </div>
        </div>
    );
};

  