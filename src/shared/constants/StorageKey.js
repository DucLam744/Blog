// Environment-specific settings
const ENV = {
    development: {
        apiUrl: 'http://localhost:9999',
    },
    production: {
        apiUrl: 'https://your-production-url.com',
    },
};
// Determine the current environment
const currentEnv = "development";
// Export the environment configuration
export const environment = ENV[currentEnv];

// Storage keys for local storage or session storage
export const STORAGE_KEY = {
    accessToken: 'blog_access_token',
    userCurrent: 'blog_user_current',
};

export const USER_CURRENT = "user_current"
export const avatarDefault = 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';
export const backgroundCertificate ='http://localhost:9001/browser/resource/%E2%80%94Pngtree%E2%80%94luxury%20golden%20rectangle%20corner%20certificate_9161451.png';
export const logo = 'http://localhost:9001/browser/resource/Navy%20Grey%20Creative%20Education%20Logo.png';