/*
* @title: Goal Map API
* @path: src/app/api/goal/route.tsx
* @description: This API is used to fetch the goal map and to set the phase to 2 if the goal map has more than 13 elements.
*/

import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_GOAL_MAP!,{
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const jsonData = await response.json();
        return NextResponse.json(jsonData, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: `Failed to fetch goal map data: ${error.message}` },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to fetch goal map data' },
            { status: 500 }
        );
    }
}