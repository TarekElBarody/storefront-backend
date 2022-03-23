import express, { Request, Response } from 'express';
import logger from '../lib/functions/logger';
import CategoryStore from '../models/categoryStore';
import { dateNow } from '../lib/functions/general';
import dotenv from 'dotenv';
import verifyTokens from '../lib/middleware/verifyTokens';
import { Category, CategoryUpdate } from '../types/index';

const store = new CategoryStore();
dotenv.config();
const userLog = new logger('userLog');

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    // set categoryAccess logger
    const categories = await store.index();
    res.json(categories);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Cannot process you request contact your administrator ' + error
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
      // set categoryAccess logger
      userLog.start(); // start the log time function event
      let validate = true;
      const category: Category = {
        name: String(req.body.name),
        parent: Number(req.body.parent),
        icon: req.body.icon ? String(req.body.icon) : null,
        created: dateNow()
      };

      if (category.name == undefined || category.name.length < 2)
        validate = false;

      if (category.parent == undefined || category.parent < 0) validate = false;

      if (validate) {
        const categories = await store.create(category);
        res.status(201).json(categories);
      } else {
        res.status(401).json({
          success: false,
          message: 'Data is missing or have some error'
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          'Cannot process you request contact your administrator ' + error
      });
    }
  } else {
    // if category not logged in return an error message
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
    const categories = await store.show(Number(req.params.id));
    res.json(categories);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Cannot process you request contact your administrator ' + error
    });
  }

  return;
};

const update = async (req: Request, res: Response): Promise<void> => {
  // check if category logged in
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || req.session.user.role == 2)
  ) {
    try {
      // set categoryAccess logger
      userLog.start(); // start the log time function event
      let validate = true;
      const category: CategoryUpdate = {
        id: Number(req.params.id),
        name: req.body.name ? String(req.body.name) : undefined,
        parent: req.body.parent ? Number(req.body.parent) : undefined,
        icon: req.body.icon ? String(req.body.icon) : undefined
      };

      if (category.name != undefined && category.name.length < 2)
        validate = false;

      if (category.parent != undefined && category.parent < 0) validate = false;

      if (validate) {
        const categories = await store.update(category);
        res.json(categories);
      } else {
        res.status(400).json({
          success: false,
          message: 'Data is missing or have some error'
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          'Cannot process you request contact your administrator ' + error
      });
    }
  } else {
    // if category not logged in return an error message
    res.status(401).json({
      success: false,
      message: 'you have to provide token first to can call this function'
    });
  }

  return;
};

const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  // check if user logged in
  if (
    req.session.user &&
    req.session.isToken === true &&
    req.session.isAdmin === true
  ) {
    try {
      // set userAccess logger
      userLog.start(); // start the log time function event
      const userID = Number(req.params.id);

      const category = await store.delete(userID);
      res.json(category);
    } catch (error) {
      res.status(401).json({
        success: false,
        message:
          'Cannot process you request contact your administrator ' + error
      });
    }
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      success: false,
      message: 'you have to provide token first to can call this function'
    });
  }

  return;
};

const categoriesHandler = (apiRoute: express.Router) => {
  apiRoute.get('/categories', index);
  apiRoute.get('/categories/:id', show);
  apiRoute.post('/categories/add', verifyTokens, create);
  apiRoute.put('/categories/:id', verifyTokens, update);
  apiRoute.delete('/categories/:id', verifyTokens, deleteCategory);
};

export default categoriesHandler;
