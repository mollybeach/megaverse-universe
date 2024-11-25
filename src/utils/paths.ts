export const getApiPath = (endpoint: string) => {
    // Remove the base path for Cloudflare Pages
    const basePath = '';
    
    // Log the configuration for debugging
    console.log('API Configuration:', {
      platform: typeof process !== 'undefined' ? 'Node.js' : 'Cloudflare',
      basePath,
      endpoint,
      fullPath: `/api/${endpoint}`
    });
  
    return `/api/${endpoint}`;
};