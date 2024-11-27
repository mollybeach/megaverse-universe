/*
* @title: CURRENT MAP API
* @path: /src/app/api/current/route.tsx
* @description: This API is used to fetch the current map and to post and delete polyanets, soloons, and comeths to the current map.
*/
import { NextResponse, NextRequest } from 'next/server';
import {  setPhase } from '@/lib/state/phaseState';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const revalidate = 60;

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
        
        if (data.map._id === process.env.NEXT_PUBLIC_PHASE_TWO_ID) {
            setPhase(2);
        }
        if (data.map._id === process.env.NEXT_PUBLIC_PHASE_ONE_ID) {
            setPhase(1);
        }
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

        // Parse emojiType
        let urlParam: string;
        let direction: string | null = null;
        let color: string | null = null;

        if (emojiType === 'POLYANET') {
            urlParam = 'polyanets';
        } else if (emojiType.includes('SOLOON')) {
            urlParam = 'soloons';
            color = emojiType.split('_')[0].toLowerCase();
        } else if (emojiType.includes('COMETH')) {
            urlParam = 'comeths';
            direction = emojiType.split('_')[0].toLowerCase();
        } else {
            return NextResponse.json({
                error: 'Invalid emojiType',
                details: { emojiType }
            }, { status: 400 });
        }

        const baseUrl = 'https://challenge.crossmint.io/api';
        const endpoint = `${baseUrl}/${urlParam}`;

        const requestBody = {
            candidateId: process.env.NEXT_PUBLIC_CANDIDATE_ID,
            row,
            column,
            ...(color && { color }),
            ...(direction && { direction })
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({
                error: 'Request failed',
                details: {
                    message: 'API request failed',
                    status: response.status,
                    statusText: response.statusText,
                    responseBody: errorText,
                    requestDetails: {
                        endpoint,
                        body: requestBody
                    }
                }
            }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({
            error: 'Request failed',
            details: {
                message: error instanceof Error ? error.message : String(error),
                type: error instanceof Error ? error.name : 'Unknown',
                stack: error instanceof Error ? error.stack : undefined,
                timestamp: new Date().toISOString()
            }
        }, { status: 500 });
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