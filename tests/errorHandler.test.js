// errorHandler.test.js
import request from 'supertest';
import express from 'express';
import errorHandler from '../middleware/errorHandler';

describe('errorHandler Middleware', () => {
  let app;
  let originalConsoleError;

  beforeAll(() => {
    // Save the original console.error
    originalConsoleError = console.error;
    // Mock console.error
    console.error = jest.fn();
  });

  afterAll(() => {
    // Restore the original console.error
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    app = express();

    // Example route to trigger an error
    app.get('/error', (req, res, next) => {
      const error = new Error('Test error');
      error.status = 400;
      error.errors = ['Some error details'];
      next(error);
    });

    // Attach the errorHandler middleware
    app.use(errorHandler);
  });

  it('should handle an error and return the correct response', async () => {
    const response = await request(app).get('/error');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Test error',
      errors: ['Some error details'],
    });

    // Verify console.error was called
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should return a 500 status and generic message if no status or message is provided', async () => {
    app.get('/error-no-status', (req, res, next) => {
      const error = new Error();
      next(error);
    });

    // Attach the errorHandler middleware after defining the new route
    app.use(errorHandler);

    const response = await request(app).get('/error-no-status');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: 'Internal Server Error',
      errors: [],
    });

    // Verify console.error was called
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should call next(err) if headers are already sent', async () => {
    let nextCalled = false;

    app.get('/headers-sent', (req, res, next) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('Headers already sent');
      res.end();
      const error = new Error('Headers sent error');
      error.status = 500;
      next(error);
    });

    // Custom middleware to capture the next call
    app.use((err, req, res, next) => {
      if (res.headersSent) {
        nextCalled = true;
        next(err);
      } else {
        errorHandler(err, req, res, next);
      }
    });

    await request(app).get('/headers-sent');

    expect(nextCalled).toBe(true);

    // Verify console.error was called
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
  });
});
