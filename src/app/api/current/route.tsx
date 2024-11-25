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
        const response = await fetch(`${process.env.NEXT_PUBLIC_CURRENT_MAP}`);
        const data = await response.json();
            
        if (data.map._id === process.env.NEXT_PUBLIC_PHASE_TWO_ID) {
            setPhase(2);
        }
        if (data.map._id === process.env.NEXT_PUBLIC_PHASE_ONE_ID) {
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

        // Validate inputs
        if (row < 0 || column < 0) {
            return NextResponse.json({ error: 'Invalid row or column' }, { status: 400 });
        }

        // Determine the endpoint and prepare the base request body
        const urlParam = (emojiType.includes('_') ? emojiType.split('_')[1].toLowerCase() : emojiType.toLowerCase()) + 's';
        const apiBody: {
            candidateId: string | undefined;
            row: number;
            column: number;
            color?: string;
            direction?: string;
        } = {
            candidateId: process.env.NEXT_PUBLIC_CANDIDATE_ID,
            row,
            column
        };

        // Add specific properties based on emoji type
        if (emojiType.includes('SOLOON')) {
            apiBody.color = emojiType.split('_')[0].toLowerCase();
        }
        if (emojiType.includes('COMETH')) {
            apiBody.direction = emojiType.split('_')[0].toLowerCase();
        }

        console.log("Making request to:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/${urlParam}`);
        console.log("With body:", JSON.stringify(apiBody));

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${urlParam}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API responded with status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("API Response:", responseData);

        // Fetch updated map data
        const updatedMap = await GET();
        return updatedMap;

    } catch (error) {
        console.error('Error in POST:', error);
        return NextResponse.json(
            { error: `Failed to process request: ${(error as Error).message}` },
            { status: 500 }
        );
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/polyanets`, {
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