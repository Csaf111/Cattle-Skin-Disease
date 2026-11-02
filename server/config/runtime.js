const MINIMUM_SESSION_SECRET_LENGTH = 32;

export function getRuntimeConfig(environment = process.env) {
  const sessionSecret = environment.SESSION_SECRET;
  if (!sessionSecret || sessionSecret.length < MINIMUM_SESSION_SECRET_LENGTH) {
    throw new Error(
      `SESSION_SECRET must be set and at least ${MINIMUM_SESSION_SECRET_LENGTH} characters long.`,
    );
  }

  if (!environment.MONGO_URI) {
    throw new Error('MONGO_URI must be set.');
  }

  if (!environment.GOOGLE_CLIENT_ID || !environment.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set.');
  }

  return {
    port: Number(environment.PORT || 8000),
    flaskServiceUrl: environment.FLASK_SERVICE_URL || 'http://127.0.0.1:5000',
    frontendOrigins: (environment.FRONTEND_ORIGINS || 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    sessionSecret,
    isProduction: environment.NODE_ENV === 'production',
  };
}
