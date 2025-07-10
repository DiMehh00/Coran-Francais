import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "686ceb9d2dc64df4585b8a28", 
  requiresAuth: true // Ensure authentication is required for all operations
});
