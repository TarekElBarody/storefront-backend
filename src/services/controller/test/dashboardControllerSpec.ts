import UserStore from '../../../models/userStore';
import CategoryStore from '../../../models/categoryStore';
import ProductStore from '../../../models/productStore';
import OrderStore from '../../../models/orderStore';
import ShoppingCartStore from '../../../models/shoppingCartStore';
import {
  Category,
  Product,
  UserRoles,
  User,
  OrderPayment,
  ShoppingCart,
  ShoppingCartRes,
  OrderStatus,
  OrderItemsStatus,
  OrderItemsUpdate,
  SignedToken,
  UserPendingCart,
  UserAll
} from '../../../types/index';
import { dateNow } from '../../../lib/functions/general';
import OrderItemsStore from '../../../models/orderItemsStore';
import { createToken } from '../../../lib/functions/hash';
import { httpApp, httpsApp, sslCert } from '../../../server';
import dotenv from 'dotenv';
import supertest from 'supertest';

dotenv.config();
// prepare server for testing
const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

const created = dateNow();
const userStore = new UserStore();
const categoryStore = new CategoryStore();
const orderStore = new OrderStore();

let resUser: User;
let resUser2: User;
let categoryID = 0;
let productRes: Product;
let productRes2: Product;
const cart: ShoppingCartRes[] = [];
let signedToken: SignedToken;

describe('Test Dashboard Service Controller (dashboardControllerSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    await userStore.truncate();

    const admin: User = {
      first_name: 'AdminFName',
      last_name: 'AdminLName',
      birthday: new Date('1990-04-01'),
      email: 'admin@admin.com',
      password: '987654321',
      mobile: '01298654374',
      role: UserRoles.Admin,
      created: created
    };
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

    signedToken = await createToken(adminToken);

    const user: User = {
      first_name: 'UserFName',
      last_name: 'UserLName',
      birthday: new Date('1990-04-01'),
      email: 'admin@admin.com',
      password: '987654321',
      mobile: '01298654374',
      role: UserRoles.Admin,
      created: created
    };

    const user2: User = {
      first_name: 'UserFName2',
      last_name: 'UserLName2',
      birthday: new Date('1990-04-01'),
      email: 'admin2@admin.com',
      password: '9876543212',
      mobile: '012986543742',
      role: UserRoles.Admin,
      created: created
    };

    await userStore.truncate();
    resUser = await userStore.create(user);
    resUser2 = await userStore.create(user2);

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
      details: { items: [{ name: 'Brand', value: 'Zero' }] },
      image: 'assets/images/products/01.jpg',
      status: 1,
      created: created
    };

    productRes = await productStore.create(product);

    const product2: Product = {
      name: 'AA Alkaline Batteries 1.5 V',
      description: `AA Alkaline Batteries 1.5 V`,
      category_id: categoryID,
      price: 23.0,
      stock: 1000,
      details: {
        items: [
          { name: 'Brand', value: 'Zero' },
          { name: 'AMP', value: '2300' }
        ]
      },
      image: 'assets/images/products/02.jpg',
      status: 1,
      created: created
    };
    productRes2 = await productStore.create(product2);

    const shoppingCartStore = new ShoppingCartStore();
    await shoppingCartStore.truncate();
    await orderStore.truncate();

    for (let i = 0; i < 10; i++) {
      if (i % 2) {
        await shoppingCartStore.empty(Number(resUser2.id));
        await shoppingCartStore.create({
          user_id: Number(resUser2.id),
          product_id: productRes2.id as number,
          qty: 2,
          note: null
        });

        await orderStore.process({
          user_id: Number(resUser2.id),
          payment_type: OrderPayment.COD,
          note: null
        });
      } else {
        await shoppingCartStore.empty(Number(resUser.id));
        await shoppingCartStore.create({
          user_id: Number(resUser.id),
          product_id: productRes.id as number,
          qty: 1,
          note: null
        });

        await orderStore.process({
          user_id: Number(resUser.id),
          payment_type: OrderPayment.COD,
          note: null
        });
      }
    }
    const orderItemsStore = new OrderItemsStore();

    const orders = await orderStore.index();

    for (let o = 0; o < orders.length; o++) {
      if (o % 2) {
        await orderStore.update({
          id: orders[o].id,
          confirmed_by: 1,
          confirmed_date: dateNow(),
          status: OrderStatus.COMPLETED
        });
        for (let s = 0; s < orders[o].items.length; s++) {
          const u: OrderItemsUpdate = {
            id: orders[o].items[s][0].id as number,
            order_id: orders[o].items[s][0].order_id as number,
            status: OrderItemsStatus.COMPLETED
          };
          await orderItemsStore.update(u);
        }
      }
    }

    const shoppingCart: ShoppingCart = {
      user_id: Number(resUser2.id),
      product_id: productRes2.id as number,
      qty: 2,
      note: null
    };

    const shoppingCart2: ShoppingCart = {
      user_id: Number(resUser2.id),
      product_id: productRes.id as number,
      qty: 3,
      note: null
    };

    const shoppingCartRes = await shoppingCartStore.create(shoppingCart);
    cart.push(shoppingCartRes);

    const shoppingCartRes2 = await shoppingCartStore.create(shoppingCart2);
    cart.push(shoppingCartRes2);
  });

  it('Should Generated Admin Token Success', async (): Promise<void> => {
    expect(signedToken.success).toBeTruthy();
  });

  it('Should Endpoint Return Top Purchased Products', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api/dashboard/top_purchased_products')
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp.get('/api/dashboard/top_purchased_products');
    }
    const products = res.body as Category[];

    expect(res.status).toBe(200);
    expect(products[0].id).toEqual(productRes2.id);
    expect(products.length).toEqual(1);
  });

  it('Should Endpoint Return Top Pending Products', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api/dashboard/top_pending_products')
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get('/api/dashboard/top_pending_products')
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    const products = res.body as Category[];

    expect(res.status).toBe(200);
    expect(products[0].id).toEqual(productRes.id);
    expect(products.length).toEqual(1);
  });

  it('Should Endpoint Return List of Pending Shopping Cart', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api/dashboard/pending_carts')
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get('/api/dashboard/pending_carts')
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    const list = res.body as UserPendingCart[];

    expect(res.status).toBe(200);
    expect(list[0].cart_items[0][0].id).toEqual(cart[0].id);
    expect(list.length).toEqual(1);
  });

  it('Should Endpoint Return List of Top Buyer', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api/dashboard/top_buyer')
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get('/api/dashboard/top_buyer')
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    const list = res.body as UserAll[];

    expect(res.status).toBe(200);
    expect(list[0].id).toEqual(resUser.id as number);
    expect(list.length).toEqual(2);
  });
});
