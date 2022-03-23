import UserStore from '../../../models/userStore';
import DashBoardData from '../dashboardData';
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
  OrderItemsUpdate
} from '../../../types/index';
import { dateNow } from '../../../lib/functions/general';
import OrderItemsStore from '../../../models/orderItemsStore';

const created = dateNow();
const store = new DashBoardData();
const userStore = new UserStore();
const categoryStore = new CategoryStore();
const orderStore = new OrderStore();

let resUser: User;
let resUser2: User;
let categoryID = 0;
let productRes: Product;
let productRes2: Product;
const cart: ShoppingCartRes[] = [];

describe('Test Dashboard Service DataBinding (dashboardDataSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    await userStore.truncate();

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

  it('Should OrderItems Model CRUD functions are defined', async (): Promise<void> => {
    expect(store.pendingCarts).toBeDefined();
    expect(store.topPendingProducts).toBeDefined();
    expect(store.topPurchasedProducts).toBeDefined();
    expect(store.topBuyer).toBeDefined();
  });

  it('Should Return Top Purchased Products', async (): Promise<void> => {
    const products = await store.topPurchasedProducts(5);

    expect(products[0].id).toEqual(productRes2.id);
    expect(products.length).toEqual(1);
  });

  it('Should Return Top Pending Products', async (): Promise<void> => {
    const products = await store.topPendingProducts(5);

    expect(products[0].id).toEqual(productRes.id);
    expect(products.length).toEqual(1);
  });

  it('Should Return List of Pending Shopping Cart', async (): Promise<void> => {
    const list = await store.pendingCarts(5);

    expect(list[0].cart_items[0][0].id).toEqual(cart[0].id);
    expect(list.length).toEqual(1);
  });

  it('Should Return List of Top Buyer', async (): Promise<void> => {
    const list = await store.topBuyer(5);

    expect(list[0].id).toEqual(resUser.id as number);
    expect(list.length).toEqual(2);
  });
});
