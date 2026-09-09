import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env if present, otherwise rely on defaults
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'bloodbridge_dev_jwt_secret_key_change_in_production_98765',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  
  escalation: {
    stage1TimeoutMinutes: parseInt(process.env.EMERGENCY_TIMEOUT_STAGE1_MINUTES || '10', 10),
    stage2TimeoutMinutes: parseInt(process.env.EMERGENCY_TIMEOUT_STAGE2_MINUTES || '20', 10),
    stage3TimeoutMinutes: parseInt(process.env.EMERGENCY_TIMEOUT_STAGE3_MINUTES || '30', 10),
    stage1RadiusKm: parseFloat(process.env.EMERGENCY_RADIUS_STAGE1_KM || '3'),
    stage2RadiusKm: parseFloat(process.env.EMERGENCY_RADIUS_STAGE2_KM || '7'),
    stage3RadiusKm: parseFloat(process.env.EMERGENCY_RADIUS_STAGE3_KM || '15'),
  },
  
  duplicateThreshold: parseFloat(process.env.DUPLICATE_SIMILARITY_THRESHOLD || '70'),
};
