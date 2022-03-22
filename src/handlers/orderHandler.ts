import express, { Request, Response } from 'express';
import logger from '../lib/functions/logger';
import OrderStore from '../models/orderStore';
import dotenv from 'dotenv';
import verifyTokens from '../lib/middleware/verifyTokens';
import { OrderInsert, OrderPayment, OrderUpdate } from '../types/index';
import ShoppingCartStore from '../models/shoppingCartStore';
import { dateNow } from '../lib/functions/general';

const store = new OrderStore();
dotenv.config();
const userLog = new logger('userLog');

const index = async (req: Request, res: Response): Promise<void> => {
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || (req.session.user.role as number) == 2)
  ) {
    try {
      const orders = await store.index();
      res.json(orders);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request ${error}`
      });
    }
  } else {
    // if order not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const userOrders = async (req: Request, res: Response): Promise<void> => {
  const user_id = Number(req.params.id);
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || (req.session.user.id as number) == user_id)
  ) {
    try {
      const orders = await store.userOrders(user_id);
      res.json(orders);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request ${error}`
      });
    }
  } else {
    // if order not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const create = async (req: Request, res: Response): Promise<void> => {
  if (
    req.session.user &&
    req.session.isToken === true &&
    req.session.isAdmin === true
  ) {
    try {
      // set orderAccess logger
      userLog.start(); // start the log time function event
      let validate = true;
      const errorMsg = [];
      const order: OrderInsert = {
        user_id: req.body.user_id ? Number(req.body.user_id) : 0,
        payment_type: req.body.payment_type
          ? Number(req.body.payment_type)
          : OrderPayment.COD,
        note: req.body.note ? String(req.body.note) : null
      };

      if (
        order.payment_type != undefined &&
        (order.payment_type <= 0 || order.payment_type > 2)
      ) {
        validate = false;
        errorMsg.push('Order Payment Type Not Valid');
      }

      if (validate) {
        const orders = await store.create(order);
        res.status(201).json(orders);
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
    // if order not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const processOrder = async (req: Request, res: Response): Promise<void> => {
  const user_id = Number(req.body.user_id);
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || (req.session.user.id as number) == user_id)
  ) {
    try {
      // set orderAccess logger
      userLog.start(); // start the log time function event
      let validate = true;
      const errorMsg = [];
      const order: OrderInsert = {
        user_id: user_id,
        payment_type: req.body.payment_type
          ? Number(req.body.payment_type)
          : OrderPayment.COD,
        note: req.body.note ? String(req.body.note) : null
      };
      const cartStore = new ShoppingCartStore();
      const shopping = await cartStore.index(user_id);

      if (!shopping || shopping.length <= 0) {
        validate = false;
        errorMsg.push('User have no items in the shopping cart');
      }

      if (
        order.payment_type != undefined &&
        (order.payment_type <= 0 || order.payment_type > 2)
      ) {
        validate = false;
        errorMsg.push('Order Payment Type Not Valid');
      }

      if (validate) {
        const orders = await store.process(order);
        res.status(201).json(orders);
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
    // if order not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const show = async (req: Request, res: Response): Promise<void> => {
  if (
    req.session.user &&
    req.session.isToken === true &&
    req.session.isAdmin === true
  ) {
    try {
      const orders = await store.showAdmin(Number(req.params.id));
      res.json(orders);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request ${error}`
      });
    }
  } else {
    // if order not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const showUserOrder = async (req: Request, res: Response): Promise<void> => {
  const user_id = Number(req.params.id);
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || (req.session.user.id as number) == user_id)
  ) {
    try {
      const orders = await store.show(Number(req.params.oid));
      res.json(orders);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request ${error}`
      });
    }
  } else {
    // if order not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const update = async (req: Request, res: Response): Promise<void> => {
  if (
    req.session.user &&
    req.session.isToken === true &&
    req.session.isAdmin === true
  ) {
    try {
      userLog.start(); // start the log time function event
      let validate = true;
      const errorMsg = [];
      const order: OrderUpdate = {
        id: Number(req.params.id),
        status: req.body.status ? Number(req.body.status) : undefined,
        payment_type: req.body.payment_type
          ? Number(req.body.payment_type)
          : undefined,
        confirmed_by: req.body.confirmed_by
          ? Number(req.body.confirmed_by)
          : undefined,
        confirmed_date: req.body.confirmed_by ? dateNow() : undefined,
        note: req.body.note ? String(req.body.note) : undefined
      };

      if (
        order.status != undefined &&
        (order.status <= 0 || order.status > 6)
      ) {
        validate = false;
        errorMsg.push('Order Status Not Valid');
      }

      if (
        order.payment_type != undefined &&
        (order.payment_type <= 0 || order.payment_type > 2)
      ) {
        validate = false;
        errorMsg.push('Order Payment Type Not Valid');
      }

      if (order.confirmed_by != undefined && order.confirmed_by <= 0) {
        validate = false;
        errorMsg.push('Order Confirmed By Type Not Valid');
      }

      if (validate) {
        const orders = await store.update(order);
        res.json(orders);
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
    // if order not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  if (
    req.session.user &&
    req.session.isToken === true &&
    req.session.isAdmin === true
  ) {
    try {
      userLog.start(); // start the log time function event
      const orderID = Number(req.params.id);

      const order = await store.delete(orderID);
      res.json(order);
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

const orderHandler = (apiRoute: express.Router) => {
  apiRoute.get('/users/:id/orders', verifyTokens, userOrders);
  apiRoute.get('/users/:id/order/:oid', verifyTokens, showUserOrder);
  apiRoute.post('/orders/process', verifyTokens, processOrder);
  apiRoute.get('/orders', verifyTokens, index);
  apiRoute.get('/orders/:id', verifyTokens, show);
  apiRoute.post('/orders/add', verifyTokens, create);
  apiRoute.put('/orders/:id', verifyTokens, update);
  apiRoute.delete('/orders/:id', verifyTokens, deleteOrder);
};

export default orderHandler;
