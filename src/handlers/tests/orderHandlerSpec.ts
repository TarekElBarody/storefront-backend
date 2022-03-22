import supertest from 'supertest';
import dotenv from 'dotenv';
import { httpApp, httpsApp, sslCert } from '../../server';
import {
  OrderUpdate,
  OrderRes,
  OrderInsert,
  OrderPayment,
  OrderStatus,
  ShoppingCart,
  ShoppingCartRes,
  SignedToken,
  User,
  UserRoles,
  Category,
  Product,
  OrderResUser
} from '../../types/index';
import { dateNow } from '../../lib/functions/general';
import { createToken } from '../../lib/functions/hash';
import UserStore from '../../models/userStore';
import OrderStore from '../../models/orderStore';
import CategoryStore from '../../models/categoryStore';
import ProductStore from '../../models/productStore';
import ShoppingCartStore from '../../models/shoppingCartStore';

dotenv.config();
// prepare server for testing
const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

let userID = 0;
let orderResUser: OrderResUser;
let orderRes: OrderRes;
const cart: ShoppingCartRes[] = [];
let userSignedToken: SignedToken;
let adminSignedToken: SignedToken;
const created = dateNow();

describe('Test Orders Handlers EndPoint (ordersHandlerSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    const orderStore = new OrderStore();
    await orderStore.truncate();

    const admin: User = {
      first_name: 'AdminFName',
      last_name: 'AdminLName',
      birthday: new Date('1990-04-01'),
      email: 'admin@admin.com',
      password: '65454545654',
      mobile: '01111111111',
      role: UserRoles.Admin,
      created: dateNow()
    };

    const user: User = {
      first_name: 'UserFName',
      last_name: 'UserLName',
      birthday: new Date('1990-04-01'),
      email: 'user@user.com',
      password: '987654321',
      mobile: '01298654374',
      role: UserRoles.User,
      created: dateNow()
    };

    const userStore = new UserStore();
    await userStore.truncate();
    const resUser = await userStore.create(user);

    const userToken = {
      exp: created.getTime() + 60 * 60,
      data: {
        id: resUser.id as number,
        first_name: resUser.first_name,
        last_name: resUser.last_name,
        role: resUser.role
      }
    };

    userSignedToken = await createToken(userToken);
    userID = resUser.id as number;

    const resAdmin = await userStore.create(admin);
    const adminToken = {
      exp: created.getTime() + 60 * 60,
      data: {
        id: resAdmin.id as number,
        first_name: resAdmin.first_name,
        last_name: resAdmin.last_name,
        role: resAdmin.role
      }
    };

    adminSignedToken = await createToken(adminToken);

    const categoryStore = new CategoryStore();
    await categoryStore.truncate();
    const category: Category = {
      name: 'Accessories',
      parent: 0,
      icon: '/assets/icons/accessories-icon.png',
      created: created
    };
    const categoryRes = await categoryStore.create(category);
    const categoryID = Number(categoryRes.id);

    const productStore = new ProductStore();
    await productStore.truncate();

    const product: Product = {
      name: 'Zero Power Bank 10000 AMP',
      description: `Zero Power Bank 10000 AMP`,
      category_id: categoryID,
      price: 2200.0,
      stock: 51,
      details: {
        items: [
          { name: 'Brand', value: 'Zero' },
          { name: 'Power', value: '10000 AMP' }
        ]
      },
      image: 'assets/images/products/01.jpg',
      status: 1,
      created: created
    };
    const productRes = await productStore.create(product);

    const product2: Product = {
      name: 'AA Alkaline Batteries 1.5 V',
      description: `AA Alkaline Batteries 1.5 V`,
      category_id: categoryID,
      price: 23.0,
      stock: 1000,
      details: {
        items: [{ name: 'Capacity', value: '2300 AMP' }]
      },
      image: 'assets/images/products/02.jpg',
      status: 1,
      created: created
    };
    const productRes2 = await productStore.create(product2);

    const shoppingCartStore = new ShoppingCartStore();
    await shoppingCartStore.truncate();

    const shoppingCart: ShoppingCart = {
      user_id: Number(resUser.id),
      product_id: productRes.id as number,
      qty: 1,
      note: null
    };

    const shoppingCart2: ShoppingCart = {
      user_id: Number(resUser.id),
      product_id: productRes2.id as number,
      qty: 10,
      note: null
    };

    const shoppingCartRes = await shoppingCartStore.create(shoppingCart);
    cart.push(shoppingCartRes);

    const shoppingCartRes2 = await shoppingCartStore.create(shoppingCart2);
    cart.push(shoppingCartRes2);
  });

  it('Should Generated User & Admin Token Success', async (): Promise<void> => {
    expect(userSignedToken.success).toBeTruthy();
    expect(adminSignedToken.success).toBeTruthy();
  });

  it('Should Endpoint User Process New Order', async (): Promise<void> => {
    const order: OrderInsert = {
      user_id: Number(userID),
      payment_type: OrderPayment.COD,
      note: 'first test order'
    };

    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .post(`/api/orders/process`)
        .send(order)
        .set('Authorization', `Bearer ${userSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .post(`/api/orders/process`)
        .send(order)
        .set('Authorization', `Bearer ${userSignedToken.token}`);
    }
    orderResUser = res.body as OrderResUser;

    expect(res.status).toBe(201);
    expect(orderResUser.user_id).toEqual(order.user_id);
  });

  it('Should Endpoint Admin Create New Order', async (): Promise<void> => {
    const order: OrderInsert = {
      user_id: Number(userID),
      payment_type: OrderPayment.COD,
      note: 'first test order'
    };

    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .post(`/api/orders/add`)
        .send(order)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .post(`/api/orders/add`)
        .send(order)
        .set('Authorization', `Bearer ${adminSignedToken.token}`);
    }

    expect(res.status).toBe(201);
    expect(orderResUser.user_id).toEqual(order.user_id);
  });

  it('Should Endpoint User Get Order details', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get(`/api/users/${userID}/order/${orderResUser.id}/`)
        .set('Authorization', `Bearer ${userSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get(`/api/users/${userID}/order/${orderResUser.id}/`)
        .set('Authorization', `Bearer ${userSignedToken.token}`);
    }
    const order = res.body as OrderResUser;

    expect(res.status).toBe(200);
    expect(order).toEqual(orderResUser);
  });

  it('Should Endpoint User Get All His Orders', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get(`/api/users/${userID}/orders`)
        .set('Authorization', `Bearer ${userSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get(`/api/users/${userID}/orders`)
        .set('Authorization', `Bearer ${userSignedToken.token}`);
    }
    const order = res.body as OrderResUser[];

    expect(res.status).toBe(200);
    expect(order).toContain(orderResUser);
  });

  it('Should Endpoint Admin Get Order details', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get(`/api/orders/${orderResUser.id}`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get(`/api/orders/${orderResUser.id}`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`);
    }
    orderRes = res.body as OrderRes;

    expect(res.status).toBe(200);
    expect(orderRes.id).toEqual(orderRes.id);
    expect(orderRes.user_info.id).toEqual(userID);
  });

  it('Should Endpoint Admin Get All Orders', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get(`/api/orders`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get(`/api/orders`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`);
    }
    const orders = res.body as OrderRes[];

    expect(res.status).toBe(200);
    expect(orders).toContain(orderRes);
  });

  it('Should Endpoint Admin Update Order to confirmed', async (): Promise<void> => {
    const updateOrder: OrderUpdate = {
      id: orderRes.id,
      confirmed_by: 1,
      confirmed_date: dateNow(),
      status: OrderStatus.CONFIRMED
    };

    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .put(`/api/orders/${orderRes.id}`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .send(updateOrder)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .put(`/api/orders/${orderRes.id}`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .send(updateOrder);
    }
    orderRes = res.body as OrderRes;

    expect(res.status).toBe(200);
    expect(orderRes.status).toEqual(OrderStatus.CONFIRMED);
  });

  it('Should Endpoint Admin Delete Order', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .delete(`/api/orders/${orderRes.id}`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .delete(`/api/orders/${orderRes.id}`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`);
    }

    const order = res.body as OrderRes;

    expect(res.status).toBe(200);

    expect(order).toEqual(orderRes);
  });

  it('Should Endpoint Error Order Require Token', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .put(`/api/orders/${orderResUser.id}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp.put(`/api/orders/${orderResUser.id}`);
    }

    expect(res.status).toBe(401);
  });
});
