/*
* @title: MegaverseManager
* @path: src/components/MegaverseManager.tsx
* @description: Component to manage the Megaverse by creating and deleting Polyanets.
*/

import React, { useState, useEffect } from 'react';
import { createPolyanet, deletePolyanet, fetchGoalMap } from '../services/api';

const MegaverseManager: React.FC = () => {
    const [row, setRow] = useState<number>(0);
    const [column, setColumn] = useState<number>(0);
    const [goalMap, setGoalMap] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCreatePolyanet = async () => {
        try {
            const result = await createPolyanet(row, column);
            console.log('Polyanet created:', result);
        } catch (err) {
            setError('Failed to create Polyanet');
            console.error(err);
        }
    };

    const handleDeletePolyanet = async () => {
        try {
            const result = await deletePolyanet(row, column);
            console.log('Polyanet deleted:', result);
        } catch (err) {
            setError('Failed to delete Polyanet');
            console.error(err);
        }
    };

    const fetchMap = async () => {
        try {
            const map = await fetchGoalMap();
            setGoalMap(map);
        } catch (err) {
            setError('Failed to fetch goal map');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMap();
    }, []);

    return (
        <div>
            <h1>Megaverse Manager</h1>
        </div>
    );
};

export default MegaverseManager;
