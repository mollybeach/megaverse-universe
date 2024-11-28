/**
 * Converts a CellType to its emoji representation
 * @param cell The cell to convert
 * @returns Object containing emoji and optional style properties
 */
import { CellType } from '@/types/types';
import { convertCellToString } from './cellTypeConverter';

export const convertCellToEmoji = (cell: CellType): {
    emoji: string;
    color?: string;
    rotation?: string;
} => {
    const cellType = convertCellToString(cell);
    
    switch(cellType) {
        case 'SPACE':
            return { emoji: '🌌' };
        case 'POLYANET':
            return { emoji: '🪐' };
        case 'WHITE_SOLOON':
            return { 
                emoji: '🌕',
                color: 'grayscale(100%)'
            };
        case 'BLUE_SOLOON':
            return { 
                emoji: '🌕',
                color: 'grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-180deg) saturate(700%) contrast(0.8)'
            };
        case 'RED_SOLOON':
            return { 
                emoji: '🌕',
                color: 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)'
            };
        case 'PURPLE_SOLOON':
            return { 
                emoji: '🌕',
                color: 'grayscale(100%) brightness(70%) sepia(50%) hue-rotate(-100deg) saturate(500%) contrast(1)'
            };
        case 'UP_COMETH':
            return { 
                emoji: '☄️',
                rotation: 'rotate-[48deg] relative top-1 right-0'
            };
        case 'DOWN_COMETH':
            return { 
                emoji: '☄️',
                rotation: 'rotate-[230deg] relative right-1 bottom-1'
            };
        case 'RIGHT_COMETH':
            return { 
                emoji: '☄️',
                rotation: 'rotate-[140deg] relative right-2 top-1'
            };
        case 'LEFT_COMETH':
            return { 
                emoji: '☄️',
                rotation: 'rotate-[330deg] relative left-0 bottom-1'
            };
        default:
            return { emoji: '🌌' };
    }
};