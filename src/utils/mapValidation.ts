import { CellType } from '@/types/types';

export const validateMap = (currentMap: CellType[][], goalMap: CellType[][] | undefined): {
    isValid: boolean;
    errors: string[];
    totalMismatches: number;
    details: {
        missing: number;
        incorrect: number;
        extra: number;
    };
} => {
    if (!goalMap) {
        return {
            isValid: false,
            errors: ['Goal map not available for validation'],
            totalMismatches: 0,
            details: { missing: 0, incorrect: 0, extra: 0 }
        };
    }

    const errors: string[] = [];
    let missing = 0;
    let incorrect = 0;
    let extra = 0;

    const isEmptyCell = (cell: string) => {
        return cell === JSON.stringify(null) || cell === JSON.stringify("SPACE");
    };

    currentMap.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const currentCell = JSON.stringify(cell);
            const goalCell = JSON.stringify(goalMap[rowIndex][colIndex]);
            
            if (currentCell !== goalCell) {
                errors.push(`Mismatch at [${rowIndex}, ${colIndex}]: Current=${currentCell}, Goal=${goalCell}`);
                
                // Count type of mismatch
                if (isEmptyCell(currentCell) && !isEmptyCell(goalCell)) {
                    missing++;
                } else if (!isEmptyCell(currentCell) && isEmptyCell(goalCell)) {
                    extra++;
                } else {
                    incorrect++;
                }
            }
        });
    });

    const totalMismatches = missing + incorrect + extra;

    return {
        isValid: totalMismatches === 0,
        errors,
        totalMismatches,
        details: { missing, incorrect, extra }
    };
};