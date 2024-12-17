/*
* @title: Map Solver
* @path: src/utils/mapSolver.ts
* @description: Generates the solved map for Phase One and Phase Two with symmetric cross patterns.
*/

import { GoalMapType } from "@/types/types";

export const generatePhaseOneMapWithAllClusters = (): GoalMapType => {
    const size = 11; // Fixed size for Phase One
    const map: GoalMapType = { goal: Array(size).fill(null).map(() => Array(size).fill("SPACE")) };

    // Generate the symmetric cross pattern
    const middle = Math.floor(size / 2); // Center of the map
    for (let i = 0; i < size; i++) {
        map.goal[middle][i] = "POLYANET"; // Horizontal line
        map.goal[i][middle] = "POLYANET"; // Vertical line
    }

    // Add diagonal POLYANET clusters
    for (let i = 2; i < size - 2; i++) {
        if (i % 2 === 0) {
            map.goal[i][i] = "POLYANET"; // Top-left to bottom-right diagonal
            map.goal[i][size - i - 1] = "POLYANET"; // Top-right to bottom-left diagonal
        }
    }

    return map;
};

/**
 * Generates the solved map for Phase Two with all observed clusters and patterns.
 * @returns The solved Phase Two map.
 */
export const generatePhaseTwoMapWithAllClusters = (): GoalMapType => {
    const rows = 30; // Fixed size for Phase Two
    const cols = 30;
    const map: GoalMapType = { goal: Array(rows).fill(null).map(() => Array(cols).fill("SPACE")) };

    // Define all clusters for POLYANET
    const polyanetClusters = [
        { startRow: 2, startCol: 2, endRow: 3, endCol: 4 },
        { startRow: 4, startCol: 3, endRow: 5, endCol: 6 },
        { startRow: 7, startCol: 5, endRow: 9, endCol: 7 },
        { startRow: 10, startCol: 7, endRow: 12, endCol: 10 },
        { startRow: 13, startCol: 9, endRow: 15, endCol: 12 },
        { startRow: 16, startCol: 11, endRow: 18, endCol: 13 },
    ];

    // Define SOLOON elements with colors
    const soloons = [
        { row: 4, col: 5, type: "BLUE_SOLOON" },
        { row: 6, col: 7, type: "PURPLE_SOLOON" },
        { row: 8, col: 8, type: "WHITE_SOLOON" },
        { row: 10, col: 10, type: "RED_SOLOON" },
        { row: 13, col: 11, type: "PURPLE_SOLOON" },
    ];

    // Define COMETH elements with directions
    const comeths = [
        { row: 2, col: 8, type: "UP_COMETH" },
        { row: 4, col: 29, type: "RIGHT_COMETH" },
        { row: 16, col: 13, type: "DOWN_COMETH" },
        { row: 18, col: 11, type: "LEFT_COMETH" },
    ];

    // Fill Polyanet clusters
    polyanetClusters.forEach(({ startRow, startCol, endRow, endCol }) => {
        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                map.goal[i][j] = "POLYANET";
            }
        }
    });

    // Add Soloon elements
    soloons.forEach(({ row, col, type }) => {
        map.goal[row][col] = type;
    });

    // Add Cometh elements
    comeths.forEach(({ row, col, type }) => {
        map.goal[row][col] = type;
    });

    return map;
};

/**
 * Solver function to generate both Phase One and Phase Two maps.
 * @returns An object containing Phase One and Phase Two maps.
 */
export const solveMaps = () => {
    const phaseOneMap = generatePhaseOneMapWithAllClusters();
    const phaseTwoMap = generatePhaseTwoMapWithAllClusters();

    return {
        phaseOne: phaseOneMap,
        phaseTwo: phaseTwoMap,
    };
};
