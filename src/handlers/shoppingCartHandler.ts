import express, { Request, Response } from 'express';
import logger from '../lib/functions/logger';
import ShoppingCartStore from '../models/shoppingCartStore';
import dotenv from 'dotenv';
import verifyTokens from '../lib/middleware/verifyTokens';
import { ShoppingCart, ShoppingCartUpdate } from '../types/index';

const store = new ShoppingCartStore();
dotenv.config();
const userLog = new logger('userLog');

const index = async (req: Request, res: Response): Promise<void> => {
  const user_id = Number(req.params.id);
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || (req.session.user.id as number) == user_id)
  ) {
    try {
      const shoppingCarts = await store.index(user_id);
      res.json(shoppingCarts);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request ${error}`
      });
    }
  } else {
    // if shoppingCart not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const create = async (req: Request, res: Response): Promise<void> => {
  const user_id = Number(req.params.id);
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || (req.session.user.id as number) == user_id)
  ) {
    try {
      // set shoppingCartAccess logger
      userLog.start(); // start the log time function event
      let validate = true;
      const errorMsg = [];
      const shoppingCart: ShoppingCart = {
        user_id: user_id,
        product_id: Number(req.body.product_id),
        qty: Number(req.body.qty),
        note: req.body.note ? String(req.body.note) : null
      };

      if (
        shoppingCart.product_id == undefined ||
        shoppingCart.product_id <= 0
      ) {
        validate = false;
        errorMsg.push('Shopping Cart Product ID is not Valid');
      }

      if (shoppingCart.qty == undefined || shoppingCart.qty <= 0) {
        validate = false;
        errorMsg.push('Shopping Cart QTY is not Valid');
      }

      if (validate) {
        const shoppingCarts = await store.create(shoppingCart);
        res.status(201).json(shoppingCarts);
      } else {
        res.status(400).json({
          success: false,
          message: 'Data is missing or have some error',
          errors: errorMsg
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request`,
        errors: error
      });
    }
  } else {
    // if shoppingCart not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const show = async (req: Request, res: Response): Promise<void> => {
  const user_id = Number(req.params.id);
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || (req.session.user.id as number) == user_id)
  ) {
    try {
      const shoppingCarts = await store.show(Number(req.params.cid), user_id);
      res.json(shoppingCarts);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request ${error}`
      });
    }
  } else {
    // if shoppingCart not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const update = async (req: Request, res: Response): Promise<void> => {
  const user_id = Number(req.params.id);
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || (req.session.user.id as number) == user_id)
  ) {
    try {
      userLog.start(); // start the log time function event
      let validate = true;
      const errorMsg = [];
      const shoppingCart: ShoppingCartUpdate = {
        id: Number(req.params.cid),
        user_id: user_id,
        qty: req.body.qty ? Number(req.body.qty) : undefined,
        note: req.body.note ? String(req.body.note) : undefined
      };

      if (shoppingCart.qty != undefined && shoppingCart.qty <= 0) {
        validate = false;
        errorMsg.push('Shopping Cart QTY is not Valid');
      }

      if (validate) {
        const shoppingCarts = await store.update(shoppingCart);
        res.json(shoppingCarts);
      } else {
        res.status(400).json({
          success: false,
          message: 'Data is missing or have some error',
          errors: errorMsg
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request`,
        errors: error
      });
    }
  } else {
    // if shoppingCart not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const deleteShoppingCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user_id = Number(req.params.id);
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || (req.session.user.id as number) == user_id)
  ) {
    try {
      userLog.start(); // start the log time function event
      const shoppingCartID = Number(req.params.cid);

      const shoppingCart = await store.delete(shoppingCartID, user_id);
      res.json(shoppingCart);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request ${error}`
      });
    }
    // set userAccess logger
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      success: false,
      message: 'you have to provide token first to can call this function'
    });
  }

  return;
};

const emptyShoppingCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user_id = Number(req.params.id);
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || (req.session.user.id as number) == user_id)
  ) {
    try {
      userLog.start(); // start the log time function event

      const shoppingCart = await store.empty(user_id);
      res.json(shoppingCart);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request ${error}`
      });
    }
  } else {
    // if shoppingCart not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const shoppingCartsHandler = (apiRoute: express.Router) => {
  apiRoute.get('/users/:id/cart', verifyTokens, index);
  apiRoute.get('/users/:id/cart/:cid', verifyTokens, show);
  apiRoute.post('/users/:id/cart/add', verifyTokens, create);
  apiRoute.put('/users/:id/cart/:cid', verifyTokens, update);
  apiRoute.delete('/users/:id/cart/:cid', verifyTokens, deleteShoppingCart);
  apiRoute.delete('/users/:id/cart', verifyTokens, emptyShoppingCart);
};

export default shoppingCartsHandler;
