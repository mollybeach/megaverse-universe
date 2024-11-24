/*
* @title: API
* @path: /src/app/api/current/route.tsx
*/
import { NextResponse, NextRequest } from 'next/server';
//import { currentMapData } from "@/lib/data/currentMap";

export async function GET() {
    try {
        const response = await fetch(`${process.env.REACT_API_API_CURRENT_MAP}`);
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
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
        const {  _id, content, candidateId, phase, __v, row, column } = body;
        console.log("POST Route : ", { _id, content, candidateId, phase, __v, row, column });

        // Validate row and column
        if (row < 0 || column < 0 || !content[row] || !content[row][column]) {
            return NextResponse.json({ error: 'Invalid row or column' }, { status: 400 }); // Bad Request
        }

        const getResponse = await GET();
        const data = await getResponse.json();
        const currentMapArray = data.map.content;

        // Update the currentMapData with the new value
        content[row][column] = 'POLYANET';
        currentMapArray[row][column] = 'POLYANET';
        currentMapArray.candidateId = candidateId;
        currentMapArray.phase = phase;
        currentMapArray.__v = __v;

        // Update the remote map on Crossmint
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polyanets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                _id,
                content,
                candidateId,
                phase,
                __v,
                row,
                column
            })
        });

        const responseData = await response.json(); // Parse the response as JSON
        console.log("Route.tsx: responseData", responseData);

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error('Error in POST:', error);
        return NextResponse.json({ error: `Failed to process current map data request: ${(error as Error).message}` }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) { 
    try {
        
        const body = await request.json();
        const {  _id, content, candidateId, phase, __v, row, column } = body;
        console.log("POST Route : ", { _id, content, candidateId, phase, __v, row, column });

        // Validate row and column
        if (row < 0 || column < 0 || !content[row] || !content[row][column]) {
            return NextResponse.json({ error: 'Invalid row or column' }, { status: 400 }); // Bad Request
        }

        const getResponse = await GET();
        const data = await getResponse.json();
        const currentMapArray = data.map.content;

        // Update the currentMapData with the new value
        content[row][column] = 'SPACE';
        currentMapArray[row][column] = 'SPACE';
        currentMapArray.candidateId = candidateId;
        currentMapArray.phase = phase;
        currentMapArray.__v = __v;

        // Update the remote map on Crossmint
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polyanets`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                _id,
                content,
                candidateId,
                phase,
                __v,
                row,
                column
            })
        });
       
        const responseData = await response.json(); // Parse the response as JSON
        console.log("Route.tsx: responseData", responseData);

        return NextResponse.json(currentMapArray, { status: 200 });
    } catch (error) {
        console.error('Error in DELETE:', error);
        return NextResponse.json({ error: `Failed to process current map data request: ${(error as Error).message}` }, { status: 500 });
    }
}