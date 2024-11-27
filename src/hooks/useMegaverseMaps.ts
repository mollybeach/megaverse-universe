import { useState, useEffect, useCallback } from 'react';
import { CellType, GoalMapType, CurrentMapType } from '@/types/types';
import { getApiPath } from '@/utils/paths';

export const useMegaverseMaps = () => {
    const [goalMapArray, setGoalMapArray] = useState<CellType[][]>([]);
    const [currentMapArray, setCurrentMapArray] = useState<CellType[][]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [phase, setPhase] = useState<number | null>(0);
    const [retryCount, setRetryCount] = useState(0);

    const fetchCurrentMap = useCallback(async () => {
        if (retryCount > 3) {
            setError('Too many failed attempts. Please refresh the page.');
            return;
        }

        try {
            const response = await fetch('/api/current', {
                method: 'GET',
                cache: 'no-store',
                next: { revalidate: 0 }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const jsonData: CurrentMapType = await response.json();
            setCurrentMapArray(jsonData.map.content);
            setPhase(jsonData.map.phase);
            setError(null);
            setRetryCount(0);
        } catch (error) {
            console.error('Error fetching current map:', error);
            setRetryCount(prev => prev + 1);
            setError('Failed to fetch current map data.');
        }
    }, [retryCount]);

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

    useEffect(() => {
        if (!error && !loading) {
            const interval = setInterval(fetchCurrentMap, 5000);
            return () => clearInterval(interval);
        }
    }, [error, loading, fetchCurrentMap]);

    return {
        goalMapArray,
        currentMapArray,
        setCurrentMapArray: (newMap: CellType[][]) => {
            setCurrentMapArray(newMap);
            setError(null);
            setRetryCount(0);
        },
        error,
        loading,
        phase,
        fetchCurrentMap
    };
};
