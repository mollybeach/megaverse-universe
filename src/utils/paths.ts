export const getBasePath = () => {
    // In development, we want to call the API directly
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        return '';
    }
    
    // In production, we need the full path
    return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

export const getApiPath = (endpoint: string) => {
    const basePath = getBasePath();
    const path = `${basePath}/api/${endpoint}`;
    console.log('API Call:', {
        environment: process.env.NEXT_PUBLIC_NODE_ENV,
        basePath,
        endpoint,
        fullPath: path
    });
    return path;
}