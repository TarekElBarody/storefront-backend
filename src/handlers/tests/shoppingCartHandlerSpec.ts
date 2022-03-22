import supertest from 'supertest';
import dotenv from 'dotenv';
import { httpApp, httpsApp, sslCert } from '../../server';
import {
  ShoppingCart,
  ShoppingCartRes,
  SignedToken,
  User,
  UserRoles,
  Category,
  Product
} from '../../types/index';
import { dateNow } from '../../lib/functions/general';
import { createToken } from '../../lib/functions/hash';
import UserStore from '../../models/userStore';
import ShoppingCartStore from '../../models/shoppingCartStore';
import CategoryStore from '../../models/categoryStore';
import ProductStore from '../../models/productStore';

dotenv.config();
// prepare server for testing
const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

const created = dateNow();
let resShoppingCart: ShoppingCartRes;
let resShoppingCart2: ShoppingCartRes;
let categoryID = 0;
let productID = 0;
let productID2 = 0;
let signedToken: SignedToken;
let userID = 0;

describe('Test ShoppingCarts Handlers EndPoint (shoppingCartsHandlerSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    const shoppingCartStore = new ShoppingCartStore();
    await shoppingCartStore.truncate();

    const admin: User = {
      first_name: 'UserFName',
      last_name: 'UserLName',
      birthday: new Date('1990-04-01'),
      email: 'user@user.com',
      password: '987654321',
      mobile: '01298654374',
      role: UserRoles.User,
      created: created
    };
    const userStore = new UserStore();
    await userStore.truncate();
    const resUser = await userStore.create(admin);
    const token = {
      exp: created.getTime() + 60 * 60,
      data: {
        id: resUser.id as number,
        first_name: resUser.first_name,
        last_name: resUser.last_name,
        role: resUser.role
      }
    };

    signedToken = await createToken(token);
    userID = resUser.id as number;

    const categoryStore = new CategoryStore();
    await categoryStore.truncate();
    const category: Category = {
      name: 'Accessories',
      parent: 0,
      icon: '/assets/icons/accessories-icon.png',
      created: created
    };
    const categoryRes = await categoryStore.create(category);
    categoryID = Number(categoryRes.id);

    const productStore = new ProductStore();
    await productStore.truncate();

    const product: Product = {
      name: 'Zero Power Bank 10000 AMP',
      description: `Zero Power Bank 10000 AMP`,
      category_id: categoryID,
      price: 2200.0,
      stock: 51,
      details: {
        items: []
      },
      image: 'assets/images/products/01.jpg',
      status: 1,
      created: created
    };
    const productRes = await productStore.create(product);
    productID = productRes.id as number;

    const product2: Product = {
      name: 'AA Alkaline Batteries 1.5 V',
      description: `AA Alkaline Batteries 1.5 V`,
      category_id: categoryID,
      price: 23.0,
      stock: 1000,
      details: {
        items: []
      },
      image: 'assets/images/products/02.jpg',
      status: 1,
      created: created
    };
    const productRes2 = await productStore.create(product2);
    productID2 = productRes2.id as number;
  });

  it('Should Generated User Token Success', async (): Promise<void> => {
    expect(signedToken.success).toBeTruthy();
  });

  it('Should Endpoint User Insert New Shopping Cart Item', async (): Promise<void> => {
    const shoppingCart: ShoppingCart = {
      user_id: userID,
      product_id: productID,
      qty: 2,
      note: null
    };

    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .post(`/api/users/${userID}/cart/add`)
        .send(shoppingCart)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .post(`/api/users/${userID}/cart/add`)
        .send(shoppingCart)
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    resShoppingCart = res.body as ShoppingCartRes;

    expect(res.status).toBe(201);
    expect(resShoppingCart.user_id).toEqual(shoppingCart.user_id);
  });

  it('Should Endpoint User Insert New Shopping Cart Item 2', async (): Promise<void> => {
    const shoppingCart2: ShoppingCart = {
      user_id: userID as number,
      product_id: productID2,
      qty: 10,
      note: null
    };

    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .post(`/api/users/${userID}/cart/add`)
        .send(shoppingCart2)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .post(`/api/users/${userID}/cart/add`)
        .send(shoppingCart2)
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    resShoppingCart2 = res.body as ShoppingCartRes;

    expect(res.status).toBe(201);
    expect(resShoppingCart2.user_id).toEqual(shoppingCart2.user_id);
  });

  it('Should Endpoint User Get All Shopping Cart Items', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get(`/api/users/${userID}/cart`)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get(`/api/users/${userID}/cart`)
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    const shoppingCarts = res.body as ShoppingCartRes[];

    expect(res.status).toBe(200);
    expect(shoppingCarts).toContain(resShoppingCart);
  });

  it('Should Endpoint User Get  Shopping Cart Item', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get(`/api/users/${userID}/cart/${resShoppingCart.id}`)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get(`/api/users/${userID}/cart/${resShoppingCart.id}`)
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    const shoppingCart = res.body as ShoppingCartRes;

    expect(res.status).toBe(200);
    expect(shoppingCart).toEqual(resShoppingCart);
  });

  it('Should Endpoint User Update Shopping Cart Item 2', async (): Promise<void> => {
    const updateShoppingCart = {
      qty: 15
    };
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .put(`/api/users/${userID}/cart/${resShoppingCart2.id}`)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .send(updateShoppingCart)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .put(`/api/users/${userID}/cart/${resShoppingCart2.id}`)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .send(updateShoppingCart);
    }
    const shoppingCart = res.body as ShoppingCartRes;

    expect(res.status).toBe(200);

    resShoppingCart2.qty = updateShoppingCart.qty;
    resShoppingCart2.total = Number(
      (resShoppingCart2.qty * resShoppingCart2.price).toFixed(3)
    );

    expect(shoppingCart).toEqual(resShoppingCart2);
  });

  it('Should Endpoint User Delete Shopping Cart Item', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .delete(`/api/users/${userID}/cart/${resShoppingCart.id}`)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .delete(`/api/users/${userID}/cart/${resShoppingCart.id}`)
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    const shoppingCart = res.body as ShoppingCartRes;

    expect(res.status).toBe(200);

    expect(shoppingCart).toEqual(resShoppingCart);
  });

  it('Should Endpoint User Empty Shopping Cart Items', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .delete(`/api/users/${userID}/cart`)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .delete(`/api/users/${userID}/cart`)
        .set('Authorization', `Bearer ${signedToken.token}`);
    }

    expect(res.status).toBe(200);
  });

  it('Should Endpoint Error ShoppingCart Require Token', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .put(`/api/users/${userID}/cart/${resShoppingCart.id}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp.put(
        `/api/users/${userID}/cart/${resShoppingCart.id}`
      );
    }

    expect(res.status).toBe(401);
  });
});
