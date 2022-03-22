import { Router } from 'express';
import apiRoute from './routePaths/apiRoute';
import webRoute from './routePaths/webRoute';

// Configure Main API Routes
const mainRoute = Router();

// Load Route to the mainRoute
mainRoute.use('/api', apiRoute);
mainRoute.use('/', webRoute);

export default mainRoute;
