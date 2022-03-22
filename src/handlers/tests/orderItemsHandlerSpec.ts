import supertest from 'supertest';
import dotenv from 'dotenv';
import { httpApp, httpsApp, sslCert } from '../../server';
import {
  OrderItems,
  OrderItemsStatus,
  OrderPayment,
  OrderInsert,
  SignedToken,
  User,
  UserRoles,
  Category,
  Product,
  ProductRes
} from '../../types/index';
import { dateNow } from '../../lib/functions/general';
import { createToken } from '../../lib/functions/hash';
import UserStore from '../../models/userStore';
import OrderItemsStore from '../../models/orderItemsStore';
import CategoryStore from '../../models/categoryStore';
import ProductStore from '../../models/productStore';
import OrderStore from '../../models/orderStore';

dotenv.config();
// prepare server for testing
const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

let userID = 0;
let orderID = 0;
let productRes: ProductRes;
let orderItemsRes: OrderItems;
let adminSignedToken: SignedToken;
let userSignedToken: SignedToken;
const created = dateNow();

describe('Test OrderItems Handlers EndPoint (orderItemsHandlerSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    const orderItemsStore = new OrderItemsStore();
    await orderItemsStore.truncate();

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
    userID = resUser.id as number;

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

    const p = await productStore.create(product);
    productRes = await productStore.view(p.id as number);

    const orderStore = new OrderStore();
    await orderStore.truncate();
    const order: OrderInsert = {
      user_id: userID,
      payment_type: OrderPayment.COD,
      note: null
    };

    await orderStore.truncate();
    const orderRes = await orderStore.create(order);
    orderID = orderRes.id as number;
  });

  it('Should Generated User & Admin Token Success', async (): Promise<void> => {
    expect(userSignedToken.success).toBeTruthy();
    expect(adminSignedToken.success).toBeTruthy();
  });

  it('Should Endpoint Admin Insert New OrderItems', async (): Promise<void> => {
    const orderItems = {
      product_id: productRes.id as number,
      qty: 2,
      status: OrderItemsStatus.PENDING
    };

    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .post(`/api/orders/${orderID}/items/add`)
        .send(orderItems)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .post(`/api/orders/${orderID}/items/add`)
        .send(orderItems)
        .set('Authorization', `Bearer ${adminSignedToken.token}`);
    }

    orderItemsRes = res.body as OrderItems;

    expect(res.status).toBe(201);
    expect(orderItemsRes.order_id).toEqual(orderID);
  });

  it('Should Endpoint Admin Get OrderItem details', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get(`/api/orders/${orderID}/items/${orderItemsRes.id}`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get(`/api/orders/${orderID}/items/${orderItemsRes.id}`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`);
    }
    orderItemsRes = res.body as OrderItems;

    expect(res.status).toBe(200);
    expect(orderItemsRes.id).toEqual(orderItemsRes.id);
    expect(orderItemsRes.order_id).toEqual(orderID);
  });

  it('Should Endpoint Admin Get All OrderItems', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get(`/api/orders/${orderID}/items`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get(`/api/orders/${orderID}/items`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`);
    }
    const orderItemsAll = res.body as OrderItems[];

    expect(res.status).toBe(200);
    expect(orderItemsAll).toContain(orderItemsRes);
  });

  it('Should Endpoint Admin Update OrderItems QTY', async (): Promise<void> => {
    const updateOrderItems = {
      qty: 3
    };

    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .put(`/api/orders/${orderID}/items/${orderItemsRes.id}`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .send(updateOrderItems)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .put(`/api/orders/${orderID}/items/${orderItemsRes.id}`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .send(updateOrderItems);
    }
    orderItemsRes = res.body as OrderItems;

    expect(res.status).toBe(200);
    expect(orderItemsRes.total).toEqual(
      updateOrderItems.qty * productRes.price
    );
  });

  it('Should Endpoint Admin Delete OrderItems', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .delete(`/api/orders/${orderID}/items/${orderItemsRes.id}`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .delete(`/api/orders/${orderID}/items/${orderItemsRes.id}`)
        .set('Authorization', `Bearer ${adminSignedToken.token}`);
    }

    const orderItems = res.body as OrderItems;

    expect(res.status).toBe(200);

    expect(orderItems).toEqual(orderItemsRes);
  });

  it('Should Endpoint Error OrderItems Require Token', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .put(`/api/orders/${orderID}/items/${orderItemsRes.id}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp.put(
        `/api/orders/${orderID}/items/${orderItemsRes.id}`
      );
    }

    expect(res.status).toBe(401);
  });
});
