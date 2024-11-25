/*
 * @title Types
 * @path /types/types.tsx
 * @description Type definitions for the application.
 */

import { LucideIcon } from "lucide-react";


  export type HeaderNavItemsType = {
    value: string;
    icon: LucideIcon | string | { src: string; alt: string };
    label: string;
    external?: string;
};

export type CellType = string | {type: number} | {type: number, color: string} | {type: number, direction: string} | null;

export type CurrentMapType = {
    map: {
        _id: string | null;
        content: CellType[][];
        candidateId: string | null;
        phase: number | null; 
        __v: number | null; 
    };
};

export type GoalMapType = {
    goal: CellType[][];
};

export type RowType = CellType[];


/*
Phase 2 
Polyanets
POST /api/polyanets with arguments 'row' and 'column' for their position in the map
DELETE /api/polyanets with arguments 'row' and 'column' will delete a Polyanet if you made a mistake
Soloons
POST /api/soloons with arguments 'row' and 'column' for their position in the map.
Additionally you should provide a 'color' argument which can be "blue", "red", "purple" or "white"
DELETE /api/soloons with arguments 'row' and 'column' will delete a Polyanet if you made a mistake
Cometh
POST /api/comeths with arguments 'row' and 'column' for their position in the map.
Additionally you should provide a 'direction' argument which can be "up", "down", "right" or "left"
DELETE /api/comeths with arguments 'row' and 'column' will delete a Polyanet if you made a mistake
*/

export type PolyanetTypeCellType ={
    row: number;
    column: number;
}

export type SoloonTypeCellType ={
    row: number;
    column: number;
    color: "blue" | "red" | "purple" | "white";
}

export type ComethTypeCellType ={
    row: number;
    column: number;
    direction: "up" | "down" | "right" | "left";
}

export type ApiBodyType = {
    _id: string | null;
    content: CellType[][];
    candidateId: string | null;
    phase: number | null;
    __v: number | null;
    row?: number; // Optional properties
    column?: number; // Optional properties
    color?: "blue" | "red" | "purple" | "white" | string; // Optional for Soloon
    direction?: "up" | "down" | "right" | "left" | string; // Optional for Cometh
}

//& (PolyanetTypeCellType | SoloonTypeCellType | ComethTypeCellType) | null;

export const cellTypes = [
    {"type": 0},
    {"type": 1, "color": "white"},
    {"type": 1, "color": "blue"},
    {"type": 1, "color": "red"},
    {"type": 1, "color": "purple"},
    {"type": 2, "direction": "up"},
    {"type": 2, "direction": "down"},
    {"type": 2, "direction": "right"},
    {"type": 2, "direction": "left"},
];