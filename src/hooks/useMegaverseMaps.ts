import { useState, useEffect } from 'react';
import { CellType, GoalMapType, CurrentMapType } from '@/types/types';
import { getApiPath } from '@/utils/paths';

export const useMegaverseMaps = () => {
    const [goalMapArray, setGoalMapArray] = useState<CellType[][]>([]);
    const [currentMapArray, setCurrentMapArray] = useState<CellType[][]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [phase, setPhase] = useState<number | null>(0);

    const fetchCurrentMap = async () => {
        try {
            const response = await fetch('/api/current', {
                method: 'GET',
                cache: 'no-store',
                next: { revalidate: 0 }
            });
            const jsonData: CurrentMapType = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setCurrentMapArray(jsonData.map.content);
            setPhase(jsonData.map.phase);
        } catch (error) {
            console.error('Error fetching current map:', error);
            setError('Failed to fetch current map data.');
            throw error;
        }
    };

    const fetchGoalMap = async () => {
        try {
            const response = await fetch(getApiPath('goal'));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData: GoalMapType = await response.json();
            setGoalMapArray(jsonData.goal);
            jsonData.goal.length > 13 ? setPhase(2) : setPhase(1);
        } catch (error) {
            console.error('Error fetching goal map:', error);
            setError('Failed to fetch goal map data.');
            throw error;
        }
    };

    useEffect(() => {
        const fetchMaps = async () => {
            try {
                await Promise.all([fetchCurrentMap(), fetchGoalMap()]);
            } catch (error) {
                console.error('Error fetching maps:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMaps();
    }, []);

    return {
        goalMapArray,
        currentMapArray,
        setCurrentMapArray,
        error,
        loading,
        phase,
        fetchCurrentMap,
        fetchGoalMap
    };
};
