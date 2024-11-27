/**
 * @title Megaverse Page
 * @fileoverview Megaverse page component
 * @path /app/megaverse/page.tsx
 */

"use client";
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Network } from "lucide-react";
import Map from '@/components/Map';
import { PlotControls } from '@/components/PlotControls';
import { LoadingCircle } from '@/components/LoadingCircle';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useMegaverseMaps } from '@/hooks/useMegaverseMaps';


const Megaverse: React.FC = () => {
    const {
        goalMapArray,
        currentMapArray,
        setCurrentMapArray,
        error,
        loading,
        phase
    } = useMegaverseMaps();
    
    const [row, setRow] = useState<number>(0);
    const [column, setColumn] = useState<number>(0);

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
        <ErrorBoundary>
            <div className="flex h-screen">
                {/* Side Navigation - Plot Controls */}
                <div className="w-72 min-h-screen bg-white dark:bg-slate-900 shadow-lg p-4 flex flex-col">
                    <ErrorBoundary>
                        <PlotControls 
                            phase={phase} 
                            row={row} 
                            column={column} 
                        />
                    </ErrorBoundary>
                </div>
        
                {/* Main Content */}
                <div className="flex-1 p-4 overflow-auto">
                    <div className={`grid gap-6 ${phase ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-2'}`}>
                        {(phase === 2 ? [...cardsData].reverse() : cardsData).map((card) => (
                            <ErrorBoundary key={card.title}>
                                <Card className={`p-6 hover:shadow-lg transition-shadow border-t-4 border-t-${card.color}-500`}>
                                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                        <card.icon className={`h-5 w-5 text-${card.color}-500`} />
                                        {card.title}
                                    </h3>
                                    {card.content}
                                </Card>
                            </ErrorBoundary>
                        ))}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Megaverse;