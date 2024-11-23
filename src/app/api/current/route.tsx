/*
* @title: API
* @path: /src/app/api/current/route.tsx
*/
import { NextResponse, NextRequest } from 'next/server';
import { currentMapData } from "@/lib/data/currentMap";

export async function GET() {
    try {
        return NextResponse.json(currentMapData, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: `Failed to fetch current map data: ${error.message}` },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to fetch current map data' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    console.log('POST method called');
    try {
        const body = await request.json();
        const { row, column } = body;

        console.log('Received data:', { row, column });

        if (row < 0 || column < 0 || !currentMapData.currentMap[row] || !currentMapData.currentMap[row][column]) {
            throw new Error('Invalid row or column index');
        }

        currentMapData.currentMap[row][column] = 'POLYANET';

        const candidateId = process.env.REACT_APP_CANDIDATE_ID;
        console.log('Sending to API:', { row, column, candidateId });
        
        const response = await fetch("https://challenge.crossmint.io/api/polyanets", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                "candidateId": candidateId,
                "row": row,
                "column": column
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Route.tsx : API Response:', responseData);
            throw new Error(`Route.tsx : Failed to update remote map: ${responseData.message || 'Unknown error'}`);
        }
        console.log("Route.tsx : Polyanet Successfully Added to Crossmint API");
        return NextResponse.json(currentMapData, { status: 200 });

    } catch (error: unknown) {
        console.error('Error in POST method:', error);
        return NextResponse.json(
            { error: `Route.tsx : Failed to process current map data request: ${error}` },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) { 
    const { searchParams } = new URL(request.url);
    const row = parseInt(searchParams.get('row') || '0', 10);
    const column = parseInt(searchParams.get('column') || '0', 10);
    
    try {
        currentMapData.currentMap[row][column] = 'SPACE';
        return NextResponse.json(currentMapData.currentMap);
    } catch (error) {
        console.error('Error deleting Polyanet locally:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}