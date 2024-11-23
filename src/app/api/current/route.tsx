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
    try {
        const body = await request.json();
        const { row, column } = body; // Expecting row and column in the body

        // Update the currentMapData with the new value
        if (currentMapData.currentMap) {
            currentMapData.currentMap[row][column] = 'POLYANET'; // Update with the new value
        }

        return NextResponse.json(currentMapData, { status: 200 }); // Return the updated map
    } catch (error: unknown) {
        return NextResponse.json(
            { error: `Failed to process current map data request: ${error}` },
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