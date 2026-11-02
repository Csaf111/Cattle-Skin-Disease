import assert from 'node:assert/strict';
import test from 'node:test';

import { getRuntimeConfig } from '../config/runtime.js';

const validEnvironment = {
  SESSION_SECRET: 'a-session-secret-that-is-longer-than-32-characters',
  MONGO_URI: 'mongodb://localhost:27017/cattle_skin_detection',
  GOOGLE_CLIENT_ID: 'local-client-id',
  GOOGLE_CLIENT_SECRET: 'local-client-secret',
};

test('returns safe defaults for local development', () => {
  const config = getRuntimeConfig(validEnvironment);

  assert.equal(config.port, 8000);
  assert.equal(config.flaskServiceUrl, 'http://127.0.0.1:5000');
  assert.deepEqual(config.frontendOrigins, ['http://localhost:5173']);
  assert.equal(config.isProduction, false);
});

test('rejects a missing or short session secret', () => {
  assert.throws(
    () => getRuntimeConfig({ ...validEnvironment, SESSION_SECRET: 'too-short' }),
    /SESSION_SECRET/,
  );
});

test('parses explicit production configuration', () => {
  const config = getRuntimeConfig({
    ...validEnvironment,
    PORT: '9000',
    FLASK_SERVICE_URL: 'http://ml:5000',
    FRONTEND_ORIGINS: 'https://app.example.com, https://admin.example.com',
    NODE_ENV: 'production',
  });

  assert.equal(config.port, 9000);
  assert.equal(config.isProduction, true);
  assert.deepEqual(config.frontendOrigins, ['https://app.example.com', 'https://admin.example.com']);
});
