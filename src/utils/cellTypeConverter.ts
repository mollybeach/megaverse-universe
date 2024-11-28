import { CellType } from '@/types/types';

/**
 * Converts a CellType (string | object | null) to its string representation
 * @param cell The cell to convert
 * @returns The string representation of the cell type
 */
export const convertCellToString = (cell: CellType): string => {
    if (cell === null || cell === "SPACE") {
        return "SPACE";
    }
    
    if (typeof cell === 'string') {
        return cell;
    }
    
    if (typeof cell === 'object') {
        switch(cell.type) {
            case 0: 
                return 'POLYANET';
            case 1: 
                return `${(cell as {color: string}).color.toUpperCase()}_SOLOON`;
            case 2: 
                return `${(cell as {direction: string}).direction.toUpperCase()}_COMETH`;
            default:
                return 'SPACE';
        }
    }
    
    return 'SPACE';
};