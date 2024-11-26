/**
 * @title Megaverse Page
 * @fileoverview Megaverse page component
 * @path /app/megaverse/page.tsx
 */

"use client";
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Network } from "lucide-react";
import CurrentMap from '@/components/CurrentMap';
import GoalMap from '@/components/GoalMap';
import { GoalMapType } from '@/types/types';
import { CurrentMapType } from '@/types/types';
import { PlotControls } from '@/components/PlotControls';
import { goalMapDataPhaseTwo } from '@/lib/data/goalMap';
import { getPhaseState, setPhase } from '@/lib/state/phaseState';
import { getApiPath } from '@/utils/paths';

const Megaverse: React.FC = () => {
    const [goalMapData, setGoalMapData] = useState<GoalMapType | null>(null);
    const [currentMapData, setCurrentMapData] = useState<CurrentMapType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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
                setCurrentMapData(jsonData);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} JSON: ${JSON.stringify(jsonData)}`);
                }
              //  const jsonData: CurrentMapType = await response.json();
              //  setCurrentMapData(jsonData);
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
                setGoalMapData(jsonData);
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
            content: <GoalMap goalMapData={getPhaseState().phase === 2 ? goalMapDataPhaseTwo : goalMapData || { goal: [] }} />
        },
        {
            title: "Current Map",
            icon: Network,
            color: "blue",
            content: <CurrentMap currentMapData={currentMapData || {map: {_id: '', content: [], candidateId: '', phase: 0, __v: 0, }}} setRow={setRow} setColumn={setColumn} />
        },
    ];

    if (loading) {
        return <div>Loading Megaverse...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    console.log("currentMapData", currentMapData)
    console.log("currentMapData._id", currentMapData?.map._id)
    if(currentMapData?.map._id === process.env.NEXT_PUBLIC_PHASE_TWO_ID){
        setPhase(2);
    }

    return (
        <div className="container mx-auto px-4 py-4">
         
           <PlotControls phase={getPhaseState().phase} updateCurrentMap={setCurrentMapData} currentMapData={currentMapData || {map: {_id: '', content: [], candidateId: '', phase: 0, __v: 0, }}} row={row} column={column} />
           <div className={`grid gap-6 ${getPhaseState().phase ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-2'}`}>
                { (getPhaseState().phase === 2 ? [...cardsData].reverse() : cardsData).map((card) => (
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
    );
};

export default Megaverse;