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

const Megaverse: React.FC = () => {
    const [goalMapData, setGoalMapData] = useState<GoalMapType | null>(null);
    const [currentMapData, setCurrentMapData] = useState<CurrentMapType | null>(null);
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
                setCurrentMapData(jsonData);
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
                const response = await fetch('/api/goal');
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
            content: <GoalMap goalMapData={goalMapData || { goal: [] }} />
        },
        {
            title: "Current Map",
            icon: Network,
            color: "blue",
            content: <CurrentMap currentMapData={currentMapData || { currentMap: [] }} />
        },
    ];

    if (loading) {
        return <div>Loading Megaverse...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-4">
           <PlotControls updateCurrentMap={setCurrentMapData} currentMapData={currentMapData || { currentMap: [] } as CurrentMapType} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {cardsData.map((card) => (
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