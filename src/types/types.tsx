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


export type CellType = string | {type: number} | null;

export type CurrentMapType = {
    map: {
        _id: string | null;
        content: CellType[][]; // Updated to reflect the new structure
        candidateId: string | null;
        phase: number | null; // Include phase if needed
        __v: number | null; // Include __v if needed
    };
};


export type GoalMapType = {
    goal: CellType[][];
};



export type RowType = CellType[];
export type PolyanetType = {
    candidateId: string;
    row: number;
    column: number;
};

