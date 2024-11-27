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

    const normalizeCell = (cell: CellType): string => {
        if (cell === null || cell === "SPACE") return "SPACE";
        
        if (typeof cell === 'object' && cell !== null) {
            // Handle object format
            if (cell.type === 0) return "POLYANET";
            if (cell.type === 1 && 'color' in cell) {
                return `${cell.color.toUpperCase()}_SOLOON`;
            }
            if (cell.type === 2 && 'direction' in cell) {
                return `${cell.direction.toUpperCase()}_COMETH`;
            }
        }
        
        // Handle string format
        return cell as string;
    };

    currentMap.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const normalizedCurrent = normalizeCell(cell);
            const normalizedGoal = normalizeCell(goalMap[rowIndex][colIndex]);
            
            if (normalizedCurrent !== normalizedGoal) {
                errors.push(`Mismatch at [${rowIndex}, ${colIndex}]: Current=${JSON.stringify(cell)}, Goal=${JSON.stringify(goalMap[rowIndex][colIndex])}`);
                
                if (normalizedCurrent === "SPACE" && normalizedGoal !== "SPACE") {
                    missing++;
                } else if (normalizedCurrent !== "SPACE" && normalizedGoal === "SPACE") {
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