import express from 'express';
import path from 'path';

// Configure API Routes
const webRoute = express.Router();

// serve favicon file
webRoute.get(
  '/favicon.ico',
  (_req: express.Request, res: express.Response): void => {
    res.header('Cache-Control', 'max-age=31536000');
    res.status(200).sendFile(path.resolve('./public/favicon.ico'));
  }
);

/// serve 404 page not found for not handled routes
webRoute.get('*', (_req: express.Request, res: express.Response): void => {
  res.header('Cache-Control', 'max-age=0');
  res.status(200).sendFile(path.resolve('./public/welcome.html'));
});

export default webRoute;
