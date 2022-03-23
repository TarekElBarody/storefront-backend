import express, { Request, Response } from 'express';
import logger from '../lib/functions/logger';
import ProductStore from '../models/productStore';
import { dateNow } from '../lib/functions/general';
import dotenv from 'dotenv';
import verifyTokens from '../lib/middleware/verifyTokens';
import { Product, ProductUpdate } from '../types/index';

const store = new ProductStore();
dotenv.config();
const userLog = new logger('userLog');

const index = async (_req: Request, res: Response): Promise<void> => {
  // set productAccess logger
  try {
    const products = await store.index();
    res.json(products);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Enable to process your request ${error}`
    });
  }

  return;
};

const create = async (req: Request, res: Response): Promise<void> => {
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || req.session.user.role == 2)
  ) {
    try {
      // set productAccess logger
      userLog.start(); // start the log time function event
      let validate = true;
      const errorMsg = [];
      const product: Product = {
        name: String(req.body.name),
        description: String(req.body.description),
        category_id: Number(req.body.category_id),
        price: Number(req.body.price),
        stock: req.body.stock ? Number(req.body.stock) : 0,
        details: {
          items: req.body.details ? JSON.parse(req.body.details).items : []
        },
        image: req.body.image ? String(req.body.image) : null,
        status: req.body.status ? Number(req.body.status) : 0,
        created: dateNow()
      };

      if (product.name == undefined || product.name.length < 2) {
        validate = false;
        errorMsg.push('Product Name is not Valid');
      }

      if (product.description == undefined || product.description.length < 2) {
        validate = false;
        errorMsg.push('Product description is not Valid');
      }

      if (product.category_id == undefined || product.category_id <= 0) {
        validate = false;
        errorMsg.push('Product category_id is not Valid');
      }

      if (product.price == undefined || product.price <= 0) {
        validate = false;
        errorMsg.push('Product price is not Valid');
      }

      if (product.image == undefined) {
        validate = false;
        errorMsg.push('Product image is not Valid');
      }

      if (product.status == undefined || !(product.status in [0, 1])) {
        validate = false;
        errorMsg.push('Product status is not Valid');
      }

      if (validate) {
        const products = await store.create(product);
        res.status(201).json(products);
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
    // if product not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const show = async (req: Request, res: Response): Promise<void> => {
  // bypass login and create test login for jasmine
  try {
    const products = await store.show(Number(req.params.id));
    res.json(products);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Enable to process your request ${error}`
    });
  }

  return;
};

const update = async (req: Request, res: Response): Promise<void> => {
  // check if product logged in
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || req.session.user.role == 2)
  ) {
    try {
      userLog.start(); // start the log time function event
      let validate = true;
      const errorMsg = [];
      const product: ProductUpdate = {
        id: Number(req.params.id),
        name: req.body.name ? String(req.body.name) : undefined,
        description: req.body.description
          ? String(req.body.description)
          : undefined,
        category_id: req.body.category_id
          ? Number(req.body.category_id)
          : undefined,
        price: req.body.price ? Number(req.body.price) : undefined,
        stock: req.body.stock ? Number(req.body.stock) : undefined,
        details: req.body.details
          ? {
              items: req.body.details ? JSON.parse(req.body.details).items : []
            }
          : undefined,
        image: req.body.image ? String(req.body.image) : undefined,
        status: req.body.status ? Number(req.body.status) : undefined
      };

      if (product.name != undefined && product.name.length < 2) {
        validate = false;
        errorMsg.push('Product Name is not Valid');
      }

      if (product.description != undefined && product.description.length < 2) {
        validate = false;
        errorMsg.push('Product description is not Valid');
      }

      if (product.category_id != undefined && product.category_id <= 0) {
        validate = false;
        errorMsg.push('Product category_id is not Valid');
      }

      if (product.price != undefined && product.price <= 0) {
        validate = false;
        errorMsg.push('Product price is not Valid');
      }

      if (product.details != undefined && product.details.items == undefined) {
        validate = false;
        errorMsg.push('Product details is not Valid');
      }

      if (product.status != undefined && !(product.status in [0, 1])) {
        validate = false;
        errorMsg.push('Product status is not Valid');
      }

      if (validate) {
        const products = await store.update(product);
        res.json(products);
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
    // set productAccess logger
  } else {
    // if product not logged in return an error message
    res.status(401).json({
      success: false,
      message: 'you have to provide token first to can call this function'
    });
  }

  return;
};

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  // check if user logged in
  if (
    req.session.user &&
    req.session.isToken === true &&
    req.session.isAdmin === true
  ) {
    try {
      userLog.start(); // start the log time function event
      const userID = Number(req.params.id);

      const product = await store.delete(userID);
      res.json(product);
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

const productsHandler = (apiRoute: express.Router) => {
  apiRoute.get('/products', index);
  apiRoute.get('/products/:id', show);
  apiRoute.post('/products/add', verifyTokens, create);
  apiRoute.put('/products/:id', verifyTokens, update);
  apiRoute.delete('/products/:id', verifyTokens, deleteProduct);
};

export default productsHandler;
