interface EmojiTypeMapping {
    entityType: string;
    color?: string;
    direction?: string;
}

export const getEmojiTypeMapping = (emojiType: string): EmojiTypeMapping => {
    if (emojiType.includes('SOLOON')) {
        return {
            entityType: 'soloons',
            color: emojiType.split('_')[0].toLowerCase()
        };
    } else if (emojiType.includes('COMETH')) {
        return {
            entityType: 'comeths',
            direction: emojiType.split('_')[0].toLowerCase()
        };
    }
    return {
        entityType: 'polyanets'
    };
};