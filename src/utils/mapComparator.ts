import { CellType } from '@/types/types';

export interface MapDifference {
    emojiType: string;
    row: number;
    column: number;
}

export const compareMapWithGoal = (currentMap: CellType[][], goalMap: string[][]): MapDifference[] => {
    const differences: MapDifference[] = [];
    
    for (let row = 0; row < goalMap.length; row++) {
        for (let col = 0; col < goalMap[row].length; col++) {
            const currentCell = typeof currentMap[row]?.[col] === 'string' 
                ? currentMap[row]?.[col] 
                : (currentMap[row]?.[col] as { type: string | number })?.type?.toString() || 'SPACE';
            const goalCell = goalMap[row][col];

            // If cells don't match, we need a change
            if (currentCell !== goalCell) {
                // If goal is SPACE, we need to delete current emoji
                if (goalCell === 'SPACE') {
                    differences.push({ 
                        emojiType: currentCell as string, 
                        row, 
                        column: col 
                    });
                } else {
                    // Otherwise add the goal emoji
                    differences.push({ 
                        emojiType: goalCell, 
                        row, 
                        column: col 
                    });
                }
            }
        }
    }
    return differences;
};
