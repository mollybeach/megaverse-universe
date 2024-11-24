/*
* @title: API
* @path: /src/app/api/current/route.tsx
*/
import { NextResponse, NextRequest } from 'next/server';
import {  setPhase } from '@/lib/state/phaseState';
//import { PolyanetTypeCellType, SoloonTypeCellType, ComethTypeCellType, ApiBodyType } from '@/types/types';
import { ApiBodyType } from '@/types/types';
export async function GET() {
    try {
        const response = await fetch(`${process.env.REACT_API_CURRENT_MAP}`);
        const data = await response.json();
            
        if (data.map._id === process.env.REACT_APP_PHASE_TWO_ID) {
            setPhase(2);
        }
        if (data.map._id === process.env.REACT_APP_PHASE_ONE_ID) {
            setPhase(1);
        }
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
        const { row, column, emojiType } = body;

        /*
        
        if (row < 0 || column < 0 || !content[row] || !content[row][column]) {
            return NextResponse.json({ error: 'Invalid row or column' }, { status: 400 });
        }*/
        const getResponse = await GET();
        const data = await getResponse.json();
        const currentMapArray = data.map.content;

        currentMapArray[row][column] = emojiType;

        const apiBody : ApiBodyType = {
            _id: data.map.content,
            content: JSON.parse(JSON.stringify(currentMapArray)),
            candidateId: data.map.candidateId,
            phase: data.map.phase,
            __v: data.map.__v,
            row : row,
            column : column
        };
        const urlParam = (emojiType.includes('_') ? emojiType.split('_')[1].toLowerCase() : emojiType.toLowerCase()) + 's'; 
        if (emojiType.includes('SOLOON')) { 
            const color = emojiType.split('_')[0].toLowerCase(); // Extract color from emojiType
            apiBody.color = color;
        }
        if (emojiType.includes('COMETH')) {
            const direction = emojiType.split('_')[0].toLowerCase(); // Extract direction from emojiType
            apiBody.direction = direction;
        }
        console.log("apiBody", JSON.stringify(apiBody));
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/${urlParam}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiBody)
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
        const { _id, content, candidateId, phase, __v, row, column } = body;

        // Log the content to check its structure
        console.log("Content being sent:", JSON.stringify(content));

        // Validate row and column
        if (row < 0 || column < 0 || !content[row] || !content[row][column]) {
            return NextResponse.json({ error: 'Invalid row or column' }, { status: 400 });
        }

        const getResponse = await GET();
        const data = await getResponse.json();
        const currentMapArray = data.map.content;

        content[row][column] = 'SPACE'; // Replace with SPACE
        currentMapArray[row][column] = 'SPACE';
        currentMapArray.candidateId = candidateId;
        currentMapArray.phase = phase;
        currentMapArray.__v = __v;

        const apiBody = { 
            _id, 
            content: JSON.parse(JSON.stringify(content)),
            candidateId, 
            phase, 
            __v, 
            row, 
            column 
        };

        // Update the remote map on Crossmint
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polyanets`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiBody)
        });
       
        const responseData = await response.json(); // Parse the response as JSON
        console.log("Route.tsx: responseData", responseData);

        return NextResponse.json(currentMapArray, { status: 200 });
    } catch (error) {
        console.error('Error in DELETE:', error);
        return NextResponse.json({ error: `Failed to process current map data request: ${(error as Error).message}` }, { status: 500 });
    }
}