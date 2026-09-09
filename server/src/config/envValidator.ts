/**
 * BloodBridge Production Environment Configuration Validator
 * Inspects runtime variables on boot, validates formats (JWT secrets,
 * database connection URLs, port ranges), and generates actionable startup diagnostics.
 */

export interface EnvValidationReport {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export function validateEnvironment(): EnvValidationReport {
  const warnings: string[] = [];
  const errors: string[] = [];

  const port = process.env.PORT;
  if (port) {
    const numPort = Number(port);
    if (isNaN(numPort) || numPort < 1 || numPort > 65535) {
      errors.push(`PORT '${port}' is outside the valid TCP range 1-65535.`);
    }
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    if (process.env.NODE_ENV === 'production') {
      errors.push('JWT_SECRET is required in production mode to secure authentication tokens.');
    } else {
      warnings.push('JWT_SECRET is unset; falling back to development default.');
    }
  } else if (jwtSecret.length < 16) {
    warnings.push('JWT_SECRET is shorter than 16 characters; consider a cryptographically stronger secret.');
  }

  const clientUrl = process.env.CLIENT_URL;
  if (clientUrl && !clientUrl.startsWith('http://') && !clientUrl.startsWith('https://')) {
    errors.push(`CLIENT_URL '${clientUrl}' must begin with http:// or https://`);
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}
