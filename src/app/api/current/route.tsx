/*
* @title: CURRENT MAP API
* @path: /src/app/api/current/route.tsx
* @description: This API is used to fetch the current map and to post and delete polyanets, soloons, and comeths to the current map.
*/
import { NextResponse, NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
interface Payload {
    candidateId: string | undefined;
    row: number;
    column: number;
    color?: string;
    direction?: string;
}

export async function GET() {
    try {
        if (!process.env.NEXT_PUBLIC_CURRENT_MAP) {
            throw new Error('NEXT_PUBLIC_CURRENT_MAP environment variable is not defined');
        }

        const response = await fetch(process.env.NEXT_PUBLIC_CURRENT_MAP, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
        
    } catch (error: unknown) {
        console.error('GET error:', error);  // Add this for debugging
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

        let entityType = 'polyanets';
        const payload: Payload = {
            candidateId: process.env.NEXT_PUBLIC_CANDIDATE_ID,
            row,
            column
        };

        if (emojiType.includes('SOLOON')) {
            entityType = 'soloons';
            payload.color = emojiType.split('_')[0].toLowerCase();
        } else if (emojiType.includes('COMETH')) {
            entityType = 'comeths';
            payload.direction = emojiType.split('_')[0].toLowerCase();
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');
        const endpoint = `${baseUrl}/${entityType}`;

        const rawResponse = await fetch(endpoint, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            body: JSON.stringify(payload),
            mode: 'cors',
            credentials: 'omit'
        });

        if (!rawResponse.ok) {
            const errorData = await rawResponse.json();
            return NextResponse.json({ error: errorData }, { status: rawResponse.status });
        }

        const data = await rawResponse.json();
        return NextResponse.json({
            map: {
                content: Array.isArray(data) ? data : [],
                phase: body.phase || null
            }
        });

    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) { 
    try {
        const body = await request.json();
        const { _id, content, candidateId, phase, __v, row, column } = body;

        console.log("Content being sent:", JSON.stringify(content));

        if (row < 0 || column < 0 || !content[row] || !content[row][column]) {
            return NextResponse.json({ error: 'Invalid row or column' }, { status: 400 });
        }

        const getResponse = await GET();
        const data = await getResponse.json();
        const currentMapArray = data.map.content;

        content[row][column] = 'SPACE'; 
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