import fs from 'fs';
import path from 'path';

// Function to load environment variables from backend/.env file
export function loadEnvVariables() {
  try {
    const envPath = path.resolve(process.cwd(), 'backend', '.env');
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envVars = envContent.split('\n');
      
      envVars.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          
          // Only set if not already defined in process.env
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error loading environment variables:', error);
    return false;
  }
}

// Load environment variables when this module is imported
loadEnvVariables();
