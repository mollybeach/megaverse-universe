/*
* @title: GoalMap
* @path: src/app/api/goal/route.tsx
* @description: API route for the goal map
*/

import { NextResponse } from 'next/server';
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