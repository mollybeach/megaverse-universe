/*
* @title: GoalMap
* @path: src/app/api/goal/route.tsx
* @description: API route for the goal map
*/

import { NextRequest, NextResponse } from 'next/server';
import { goalMapData } from "@/lib/data/goalMap";
      
export async function GET() {
  try {
      return NextResponse.json(goalMapData, { status: 200 });
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

  export async function POST(request: Request, row: number, column: number) {
    try {
      const body = await request.json();
      const filteredData = body.filter ? goalMapData.goal[row][column] : goalMapData.goal[row][column];
      
      return NextResponse.json(filteredData, { status: 200 });
    } catch (error: unknown) {
      return NextResponse.json(
        { error: `Failed to process goal map data request: ${error}` },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(request: NextRequest) { 
    const { row, column } = await request.json(); 
    try {
        goalMapData.goal[row][column] = 'SPACE';
        return NextResponse.json(goalMapData.goal)
    } catch (error) {
        console.error('Error deleting Polyanet locally:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
