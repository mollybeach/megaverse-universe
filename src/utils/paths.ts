export const getApiPath = (endpoint: string) => {
    // Detect Cloudflare environment more reliably
    const isCloudflare = typeof navigator !== 'undefined' && navigator.userAgent.includes('Cloudflare-Workers');
    
    // Log the configuration for debugging
    console.log('API Configuration:', {
      platform: isCloudflare ? 'Cloudflare' : 'Node.js',
      environment: process.env.NODE_ENV,
      endpoint,
      fullPath: `/api/${endpoint}`
    });
  
    return `/api/${endpoint}`;
};