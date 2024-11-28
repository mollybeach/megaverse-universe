import { CellType } from '@/types/types';

export interface MapDifference {
    type: 'POLYANET' | 'SOLOON' | 'COMETH';
    row: number;
    column: number;
    color?: string;
    direction?: string;
}

export const compareMapWithGoal = (currentMap: CellType[][], goalMap: string[][]): MapDifference[] => {
    const differences: MapDifference[] = [];
    for (let row = 0; row < goalMap.length; row++) {
        for (let col = 0; col < goalMap[row].length; col++) {
            const currentCell = typeof currentMap[row]?.[col] === 'string' 
            ? currentMap[row]?.[col] 
            : (currentMap[row]?.[col] as { type: string | number })?.type?.toString() || 'SPACE';
            const goalCell = goalMap[row][col];
            if (currentCell !== goalCell && goalCell !== 'SPACE') {
                if (goalCell.includes('POLYANET')) {
                    differences.push({ type: 'POLYANET', row, column: col });
                } 
                else if (goalCell.includes('SOLOON')) {
            const color = goalCell.split('_')[0].toLowerCase();
            differences.push({ type: 'SOLOON', row, column: col, color });
        }
        else if (goalCell.includes('COMETH')) {
            const direction = goalCell.split('_')[0].toLowerCase();
            differences.push({ type: 'COMETH', row, column: col, direction });
        }
    }
    }
    }
    return differences;
};