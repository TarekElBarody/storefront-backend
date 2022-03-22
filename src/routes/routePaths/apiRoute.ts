import express from 'express';
import usersHandler from '../../handlers/usersHandler';
import categoriesHandler from '../../handlers/categoriesHandler';
import productsHandler from '../../handlers/productsHandler';
import shoppingCartHandler from '../../handlers/shoppingCartHandler';
import orderHandler from '../../handlers/orderHandler';
import orderItemsHandler from '../../handlers/orderItemsHandler';
import dashboardController from '../../services/controller/dashboardController';

// Configure API Routes
const apiRoute = express.Router();

// call api/users
usersHandler(apiRoute);

// call api/categories
categoriesHandler(apiRoute);

// call api/products
productsHandler(apiRoute);

// call api/users/cart
shoppingCartHandler(apiRoute);

// call api/orders
orderHandler(apiRoute);

// call api/orders
orderItemsHandler(apiRoute);

dashboardController(apiRoute);

// set api/ to be the main route and provide instruction message
apiRoute.get('/', (_req: express.Request, res: express.Response): void => {
  res.status(200).json({
    message:
      'This is the API main page .. please read the API documentation for more help'
  });
});

// Set up JSON error message for invalid or not exists api routes
apiRoute.use((_req: express.Request, res: express.Response): void => {
  res.status(404).json({
    message: 'API Page Not Found !.'
  });
});

export default apiRoute;
