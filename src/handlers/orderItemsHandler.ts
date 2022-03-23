import express, { Request, Response } from 'express';
import logger from '../lib/functions/logger';
import OrderItemsStore from '../models/orderItemsStore';
import ProductStore from '../models/productStore';
import OrderStore from '../models/orderStore';
import dotenv from 'dotenv';
import verifyTokens from '../lib/middleware/verifyTokens';
import {
  OrderItemsInsert,
  OrderItemsStatus,
  OrderItemsUpdate
} from '../types/index';

const store = new OrderItemsStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();
dotenv.config();
const userLog = new logger('userLog');

const index = async (req: Request, res: Response): Promise<void> => {
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || (req.session.user.role as number) == 2)
  ) {
    try {
      const orderID = Number(req.params.oid);
      const orderItems = await store.index(orderID);
      res.json(orderItems);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request ${error}`
      });
    }
  } else {
    // if orderItems not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const userIndex = async (req: Request, res: Response): Promise<void> => {
  const user_id = Number(req.params.uid);
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true ||
      (req.session.user.role as number) == 2 ||
      (req.session.user.id as number) == user_id)
  ) {
    try {
      const orderID = Number(req.params.oid);
      const orderItems = await store.userIndex(orderID, user_id);
      res.json(orderItems);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request ${error}`
      });
    }
  } else {
    // if orderItems not logged in return an error message
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
    (req.session.isAdmin === true || (req.session.user.role as number) == 2)
  ) {
    try {
      const orderID = Number(req.params.oid);
      const productInfo = await productStore.view(Number(req.body.product_id));
      const order = await orderStore.show(orderID);

      userLog.start(); // start the log time function event
      let validate = true;
      const errorMsg = [];
      const orderItems: OrderItemsInsert = {
        order_id: orderID,
        product_id: Number(productInfo.id),
        product_info: productInfo,
        qty: req.body.qty ? Number(req.body.qty) : 1,
        price: productInfo.price,
        total: 0,
        status: OrderItemsStatus.PENDING
      };

      orderItems.total = orderItems.qty * productInfo.price;

      if (order.id == undefined || order.id <= 0) {
        validate = false;
        errorMsg.push('Order ID Not Valid');
      }

      if (
        orderItems.product_id == undefined ||
        orderItems.product_id != productInfo.id
      ) {
        validate = false;
        errorMsg.push('Product ID Not Valid');
      }

      if (orderItems.qty == undefined || orderItems.qty <= 0) {
        validate = false;
        errorMsg.push('QTY ID Not Valid');
      }

      if (validate) {
        const orderItemsRes = await store.create(orderItems);
        res.status(201).json(orderItemsRes);
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
    // if orderItems not logged in return an error message
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
    (req.session.isAdmin === true || (req.session.user.role as number) == 2)
  ) {
    try {
      const orderItems = await store.show(
        Number(req.params.id),
        Number(req.params.oid)
      );
      res.json(orderItems);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request ${error}`
      });
    }
  } else {
    // if orderItems not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const userShow = async (req: Request, res: Response): Promise<void> => {
  const user_id = Number(req.params.uid);
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true ||
      (req.session.user.role as number) == 2 ||
      (req.session.user.id as number) == user_id)
  ) {
    try {
      const orderItems = await store.userShow(
        Number(req.params.id),
        Number(req.params.oid),
        user_id
      );
      res.json(orderItems);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Enable to process your request ${error}`
      });
    }
  } else {
    // if orderItems not logged in return an error message
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
    (req.session.isAdmin === true || (req.session.user.role as number) == 2)
  ) {
    try {
      userLog.start(); // start the log time function event
      let validate = true;
      const errorMsg = [];
      const orderItems: OrderItemsUpdate = {
        id: Number(req.params.id),
        order_id: Number(req.params.oid),
        qty: req.body.qty ? Number(req.body.qty) : undefined,
        status: req.body.status ? Number(req.body.status) : undefined
      };

      if (
        orderItems.status != undefined &&
        (orderItems.status <= 0 || orderItems.status > 6)
      ) {
        validate = false;
        errorMsg.push('OrderItems Status Not Valid');
      }

      if (orderItems.qty != undefined && orderItems.qty <= 0) {
        validate = false;
        errorMsg.push('OrderItems QTY Not Valid');
      }

      if (validate) {
        const orderItemsRes = await store.update(orderItems);
        res.json(orderItemsRes);
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
    // if orderItems not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const deleteOrderItems = async (req: Request, res: Response): Promise<void> => {
  if (
    req.session.user &&
    req.session.isToken === true &&
    req.session.isAdmin === true
  ) {
    try {
      userLog.start(); // start the log time function event
      const orderItemsID = Number(req.params.id);
      const orderID = Number(req.params.oid);

      const orderItems = await store.delete(orderItemsID, orderID);
      res.json(orderItems);
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

const orderItemsHandler = (apiRoute: express.Router) => {
  apiRoute.get('/orders/:oid/items', verifyTokens, index);
  apiRoute.get('/orders/:oid/items/:id', verifyTokens, show);
  apiRoute.post('/orders/:oid/items/add', verifyTokens, create);
  apiRoute.put('/orders/:oid/items/:id', verifyTokens, update);
  apiRoute.delete('/orders/:oid/items/:id', verifyTokens, deleteOrderItems);
  apiRoute.get('/users/:uid/orders/:oid/items', verifyTokens, userIndex);
  apiRoute.get('/users/:uid/orders/:oid/items/:id', verifyTokens, userShow);
};

export default orderItemsHandler;
