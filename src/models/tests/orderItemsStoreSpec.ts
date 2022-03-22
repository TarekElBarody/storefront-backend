import UserStore from '../userStore';
import OrderItemsStore from '../orderItemsStore';
import CategoryStore from '../categoryStore';
import ProductStore from '../productStore';
import OrderStore from '../orderStore';
import {
  OrderItemsUpdate,
  Category,
  Product,
  UserRoles,
  User,
  OrderItemsInsert,
  OrderItemsStatus,
  OrderInsert,
  OrderPayment,
  ProductRes
} from '../../types/index';
import { dateNow } from '../../lib/functions/general';

const created = dateNow();
const store = new OrderItemsStore();
const userStore = new UserStore();
const categoryStore = new CategoryStore();
const orderStore = new OrderStore();

let resUser: User;
let categoryID = 0;
let productRes: ProductRes;
let orderItemsID = 0;
let orderID = 0;

describe('Test OrderItems Model (orderItemsStoreSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    await store.truncate();

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

    await userStore.truncate();
    resUser = await userStore.create(user);

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

    const p = await productStore.create(product);
    productRes = await productStore.view(p.id as number);

    const order: OrderInsert = {
      user_id: Number(resUser.id),
      payment_type: OrderPayment.COD,
      note: null
    };

    await orderStore.truncate();
    const orderRes = await orderStore.create(order);
    orderID = orderRes.id as number;
  });

  it('Should OrderItems Model CRUD functions are defined', async (): Promise<void> => {
    expect(store.create).toBeDefined();
    expect(store.index).toBeDefined();
    expect(store.show).toBeDefined();
    expect(store.update).toBeDefined();
    expect(store.delete).toBeDefined();
    expect(store.truncate).toBeDefined();
  });

  it('Should Admin Insert New OrderItems', async (): Promise<void> => {
    const orderItems: OrderItemsInsert = {
      order_id: orderID,
      product_id: productRes.id as number,
      product_info: productRes,
      qty: 2,
      price: productRes.price,
      total: 2 * productRes.price,
      status: OrderItemsStatus.PENDING
    };

    const orderItemsRes = await store.create(orderItems);
    orderItemsID = orderItemsRes.id as number;

    expect(orderItemsRes.order_id).toEqual(orderItems.order_id);
    expect(orderItemsRes.product_info.name).toEqual(productRes.name);
  });

  it('Should Return an OrderItems', async (): Promise<void> => {
    const orderItemsRes = await store.show(orderItemsID, orderID);

    expect(orderItemsRes.id).toEqual(orderItemsID);
  });

  it('Should Return All OrderItems', async (): Promise<void> => {
    const orderItems = await store.index(orderID);

    const orderItem = await store.show(orderItemsID, orderID);

    expect(orderItems).toContain(orderItem);
  });

  it('Should update OrderItems - Status CONFIRMED', async (): Promise<void> => {
    // UPDATING THE VALUE
    const orderItems: OrderItemsUpdate = {
      id: orderItemsID,
      order_id: orderID,
      status: OrderItemsStatus.CONFIRMED
    };
    const orderItemsRes = await store.update(orderItems);

    expect(orderItemsRes.status).toEqual(OrderItemsStatus.CONFIRMED);
  });

  it('Should Delete OrderItems', async (): Promise<void> => {
    const orderItemsRes = await store.delete(orderItemsID, orderID);

    expect(orderItemsRes.id).toEqual(orderItemsID);
  });

  it('Should Truncate OrderItems Data', async (): Promise<void> => {
    const res = await store.truncate();

    expect(res).toBeTrue();
  });
});
