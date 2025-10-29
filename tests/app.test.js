const request = require('supertest');
const app = require('../app');

describe('Endpoint Tests', () => {
  describe('GET /ping', () => {
    it('should return 200 OK with no body', async () => {
      const response = await request(app).get('/ping');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /about', () => {
    it('should return 200 OK with user data in JSend format', async () => {
      const response = await request(app).get('/about');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('nombreCompleto');
      expect(response.body.data).toHaveProperty('cedula');
      expect(response.body.data).toHaveProperty('seccion');
      expect(typeof response.body.data.nombreCompleto).toBe('string');
      expect(typeof response.body.data.cedula).toBe('string');
      expect(typeof response.body.data.seccion).toBe('string');
    });
  });
});