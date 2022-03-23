import express, { Request, Response } from 'express';
import logger from '../../lib/functions/logger';
import DashboardData from '../dataBinding/dashboardData';
import dotenv from 'dotenv';
import verifyTokens from '../../lib/middleware/verifyTokens';

const store = new DashboardData();
dotenv.config();
const userLog = new logger('userLog');

const topPurchasedProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  // check if user have admin access
  try {
    // set userLog logger
    userLog.start(); // start the log time function event
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const products = await store.topPurchasedProducts(limit);
    res.json(products);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Cannot process you request contact your administrator ' + error
    });
  }

  return;
};

const topPendingProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  // check if user have admin access
  try {
    // set userLog logger
    userLog.start(); // start the log time function event
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const products = await store.topPendingProducts(limit);
    res.json(products);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Cannot process you request contact your administrator ' + error
    });
  }

  return;
};

const pendingCarts = async (req: Request, res: Response): Promise<void> => {
  // check if user logged in
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || req.session.user.role === 2)
  ) {
    try {
      // set userLog logger
      userLog.start(); // start the log time function event
      const limit = req.query.limit ? Number(req.query.limit) : 5;
      const users = await store.pendingCarts(limit);
      res.json(users);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Cannot process you request contact your administrator ' + error
      });
    }
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const topBuyer = async (req: Request, res: Response): Promise<void> => {
  // check if user logged in
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || req.session.user.role === 2)
  ) {
    try {
      // set userLog logger
      userLog.start(); // start the log time function event
      const limit = req.query.limit ? Number(req.query.limit) : 5;
      const users = await store.topBuyer(limit);
      res.json(users);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Cannot process you request contact your administrator ' + error
      });
    }
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const dashboardController = (apiRoute: express.Router) => {
  apiRoute.get('/dashboard/top_purchased_products', topPurchasedProducts);
  apiRoute.get(
    '/dashboard/top_pending_products',
    verifyTokens,
    topPendingProducts
  );
  apiRoute.get('/dashboard/pending_carts', verifyTokens, pendingCarts);
  apiRoute.get('/dashboard/top_buyer', verifyTokens, topBuyer);
};

export default dashboardController;
