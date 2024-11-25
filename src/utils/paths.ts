export const getBasePath = () => {
    // Check if we're in development mode
    return process.env.NODE_ENV === 'development' 
        ? '' 
        : process.env.NEXT_PUBLIC_BASE_PATH || '';
}

export const getApiPath = (endpoint: string) => {
    return `${getBasePath()}/api/${endpoint}`;
}