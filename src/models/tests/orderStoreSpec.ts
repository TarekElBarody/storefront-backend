import UserStore from '../userStore';
import OrderStore from '../orderStore';
import CategoryStore from '../categoryStore';
import ProductStore from '../productStore';
import ShoppingCartStore from '../shoppingCartStore';
import {
  ShoppingCart,
  ShoppingCartRes,
  OrderUpdate,
  Category,
  Product,
  UserRoles,
  User,
  OrderInsert,
  OrderPayment,
  OrderStatus
} from '../../types/index';
import { dateNow } from '../../lib/functions/general';

const created = dateNow();
const store = new OrderStore();
const userStore = new UserStore();
const categoryStore = new CategoryStore();
const shoppingCartStore = new ShoppingCartStore();

let resUser: User;
let categoryID = 0;
let productRes: Product;
let productRes2: Product;
let orderID = 0;
const cart: ShoppingCartRes[] = [];

describe('Test Order Model (orderStoreSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    await store.truncate();

    const user: User = {
      first_name: 'UserFName',
      last_name: 'UserLName',
      birthday: new Date('1990-04-01'),
      email: 'user@user.com',
      password: '987654321',
      mobile: '01298654374',
      role: UserRoles.User,
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

  it('Should Order Model CRUD functions are defined', async (): Promise<void> => {
    expect(store.create).toBeDefined();
    expect(store.process).toBeDefined();
    expect(store.index).toBeDefined();
    expect(store.show).toBeDefined();
    expect(store.showAdmin).toBeDefined();
    expect(store.update).toBeDefined();
    expect(store.delete).toBeDefined();
    expect(store.truncate).toBeDefined();
  });

  it('Should User Process New Order From Shopping Cart', async (): Promise<void> => {
    const order: OrderInsert = {
      user_id: Number(resUser.id),
      payment_type: OrderPayment.COD,
      note: null
    };

    const orderRes = await store.process(order);
    orderID = orderRes.id as number;

    expect(orderRes.user_id).toEqual(order.user_id);
    expect(orderRes.items[0][0].product_id).toEqual(cart[0].product_id);
  });

  it('Should Admin Create New Order', async (): Promise<void> => {
    const order: OrderInsert = {
      user_id: Number(resUser.id),
      payment_type: OrderPayment.COD,
      note: null
    };

    const orderRes = await store.create(order);

    expect(orderRes.user_id).toEqual(order.user_id);
  });

  it('Should Return an Order', async (): Promise<void> => {
    const orderRes = await store.show(orderID);

    expect(orderRes.id).toEqual(orderID);
  });

  it('Should Return All Orders', async (): Promise<void> => {
    const orders = await store.index();

    const order = await store.showAdmin(orderID);

    expect(orders).toContain(order);
  });

  it('Should Return All User Orders', async (): Promise<void> => {
    const orders = await store.userOrders(Number(resUser.id));

    const order = await store.show(orderID);

    expect(orders).toContain(order);
  });

  it('Should update Order - Confirmed ', async (): Promise<void> => {
    // UPDATING THE VALUE
    const order: OrderUpdate = {
      id: orderID,
      confirmed_by: 1,
      confirmed_date: dateNow(),
      status: OrderStatus.CONFIRMED
    };
    const orderRes = await store.update(order);

    expect(orderRes.status).toEqual(OrderStatus.CONFIRMED);
  });

  it('Should Delete Order', async (): Promise<void> => {
    const orderRes = await store.delete(orderID);

    expect(orderRes.id).toEqual(orderID);
  });

  it('Should Truncate Order Data', async (): Promise<void> => {
    const res = await store.truncate();

    expect(res).toBeTrue();
  });
});
