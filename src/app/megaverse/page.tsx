/**
 * @title Megaverse Page
 * @fileoverview Megaverse page component
 * @path /app/megaverse/page.tsx
 */

"use client";
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Network } from "lucide-react";
import Map from '@/components/Map';
import { GoalMapType } from '@/types/types';
import { CurrentMapType } from '@/types/types';
import { PlotControls } from '@/components/PlotControls';
import { getApiPath } from '@/utils/paths';
import { CellType } from '@/types/types';
import { LoadingCircle } from '@/components/LoadingCircle';


const Megaverse: React.FC = () => {
    const [goalMapArray, setGoalMapArray] = useState<CellType[][]>([]);
    const [currentMapArray, setCurrentMapArray] = useState<CellType[][]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [phase, setPhase] = useState<number | null>(0);
    const [row, setRow] = useState<number>(0);
    const [column, setColumn] = useState<number>(0);

    useEffect(() => {
        const fetchCurrentMapData = async () => {
            try {
                const response = await fetch('/api/current', {
                    method: 'GET',
                    cache: 'no-store',
                    next: { revalidate: 0 }
                });
                const jsonData: CurrentMapType = await response.json();
                setCurrentMapArray(jsonData.map.content);
                setPhase(jsonData.map.phase);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} JSON: ${JSON.stringify(jsonData)}`);
                }
                console.log("jsonData", jsonData)
            } catch (_error) {
                console.error('Error fetching current map data:', _error);
                setError('Failed to fetch current map data.');
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentMapData();
    }, []);

    useEffect(() => {
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
                console.error('Error fetching goal map data:', error);
                setError('Failed to fetch goal map data.');
            } finally {
                setLoading(false);
            }
        };

        fetchGoalMap();
    }, []);
    const cardsData = [
        {
            title: "Goal Map",
            icon: Network,
            color: "green",
            content: <Map mapArray={goalMapArray || []}  setRow={setRow} setColumn={setColumn} />
        },
        {
            title: "Current Map",
            icon: Network,
            color: "blue",
            content: <Map mapArray={currentMapArray || []}  setRow={setRow} setColumn={setColumn}/>
        },
    ];

    if (loading) {
        return <LoadingCircle message="Loading Megaverse..." />;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex h-screen">
            {/* Side Navigation - Plot Controls */}
            <div className="w-72 min-h-screen bg-white dark:bg-slate-900 shadow-lg p-4 flex flex-col">
                <PlotControls 
                    phase={phase} 
                    updateCurrentMap={setCurrentMapArray} 
                    currentMap={currentMapArray}
                    row={row} 
                    column={column} 
                    goalMap={goalMapArray}
                />
            </div>
    
            {/* Main Content */}
            <div className="flex-1 p-4 overflow-auto">
                <div className={`grid gap-6 ${phase ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-2'}`}>
                    {(phase === 2 ? [...cardsData].reverse() : cardsData).map((card) => (
                        <Card
                            key={card.title}
                            className={`p-6 hover:shadow-lg transition-shadow border-t-4 border-t-${card.color}-500`}
                        >
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <card.icon className={`h-5 w-5 text-${card.color}-500`} />
                                {card.title}
                            </h3>
                            {card.content}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Megaverse;