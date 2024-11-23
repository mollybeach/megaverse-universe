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

export type CurrentMapType = {
    currentMap: string[][];
};

export type GoalMapType = {
    goal: string[][];
};

export type CellType = string;

export type RowType = CellType[];
export type PolyanetType = {
    candidateId: string;
    row: number;
    column: number;
};

