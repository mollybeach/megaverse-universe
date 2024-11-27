/*
* @title: GoalMap
* @path: src/app/api/goal/route.tsx
* @description: API route for the goal map
*/

import { NextResponse } from 'next/server';
import { setPhase } from '@/lib/state/phaseState';

export async function GET() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_GOAL_MAP!,{
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const jsonData = await response.json();
    
   if(jsonData.goal.length > 13){
        setPhase(2);
   }
      return NextResponse.json(jsonData, { status: 200 });
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