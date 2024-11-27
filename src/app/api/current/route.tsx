/*
* @title: CURRENT MAP API
* @path: /src/app/api/current/route.tsx
* @description: This API is used to fetch the current map and to post and delete polyanets, soloons, and comeths to the current map.
*/
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Helper function to handle API responses
async function handleApiResponse(response: Response) {
    if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({
            error: 'API request failed',
            details: {
                status: response.status,
                message: errorText
            }
        }, { status: response.status });
    }
    return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { row, column, emojiType } = body;

        // Determine endpoint and body parameters
        const config = {
            urlParam: '',
            extraParams: {} as { color?: string; direction?: string }
        };

        switch(true) {
            case emojiType === 'POLYANET':
                config.urlParam = 'polyanets';
                break;
            case emojiType.includes('SOLOON'):
                config.urlParam = 'soloons';
                config.extraParams.color = emojiType.split('_')[0].toLowerCase();
                break;
            case emojiType.includes('COMETH'):
                config.urlParam = 'comeths';
                config.extraParams.direction = emojiType.split('_')[0].toLowerCase();
                break;
            default:
                return NextResponse.json({
                    error: 'Invalid emojiType',
                    details: { emojiType }
                }, { status: 400 });
        }

        // Construct request body
        const requestBody = {
            candidateId: process.env.NEXT_PUBLIC_CANDIDATE_ID,
            row,
            column,
            ...config.extraParams
        };

        // Make the request
        const response = await fetch(
            `https://challenge.crossmint.io/api/${config.urlParam}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            }
        );

        return handleApiResponse(response);

    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({
            error: 'Request failed',
            details: {
                message: error instanceof Error ? error.message : String(error),
                timestamp: new Date().toISOString()
            }
        }, { status: 500 });
    }
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
        return NextResponse.json(data);
        
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch map data' },
            { status: 500 }
        );
    }
}