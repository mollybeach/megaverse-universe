export const getApiPath = (endpoint: string) => {
    const environment = process.env.NEXT_PUBLIC_NODE_ENV || 'production';
    const basePath = environment === 'production' ? '/megaverse-universe' : '';
    
    // Log the configuration
    console.log('API Configuration:', {
      environment,
      basePath,
      endpoint,
      fullPath: `${basePath}/api/${endpoint}`
    });
  
    return `${basePath}/api/${endpoint}`;
  };