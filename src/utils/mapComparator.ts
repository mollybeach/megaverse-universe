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
            const current = currentMap[row]?.[col];
            let currentCell = 'SPACE';
            if (typeof current === 'string') {
                currentCell = current;
            } else if (current && typeof current === 'object') {
                switch(current.type) {
                    case 0: currentCell = 'POLYANET'; break;
                    case 1: currentCell = `${(current as {color: string}).color.toUpperCase()}_SOLOON`; break;
                    case 2: currentCell = `${(current as {direction: string}).direction.toUpperCase()}_COMETH`; break;
                }
            }

            const goalCell = goalMap[row][col];
            if (currentCell !== goalCell) {
                differences.push({ 
                    emojiType: goalCell,
                    row, 
                    column: col 
                });
            }
        }
    }
    return differences;
};