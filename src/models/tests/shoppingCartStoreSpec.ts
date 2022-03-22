import ShoppingCartStore from '../shoppingCartStore';
import CategoryStore from '../categoryStore';
import ProductStore from '../productStore';
import {
  ShoppingCart,
  ShoppingCartUpdate,
  Category,
  Product,
  UserRoles,
  User
} from '../../types/index';
import { dateNow } from '../../lib/functions/general';
import UserStore from '../userStore';

const created = dateNow();
const store = new ShoppingCartStore();
let userID = 0;
let categoryID = 0;
let productRes: Product;
let productRes2: Product;
let shoppingCartID = 0;

describe('Test ShoppingCart Model (shoppingCartStoreSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    await store.truncate();

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
    productRes = await productStore.create(product);

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
    productRes2 = await productStore.create(product2);
  });

  it('Should ShoppingCart Model CRUD functions are defined', async (): Promise<void> => {
    expect(store.create).toBeDefined();
    expect(store.index).toBeDefined();
    expect(store.show).toBeDefined();
    expect(store.update).toBeDefined();
    expect(store.delete).toBeDefined();
    expect(store.empty).toBeDefined();
    expect(store.truncate).toBeDefined();
  });

  it('Should Insert New Shopping Cart Item', async (): Promise<void> => {
    const shoppingCart: ShoppingCart = {
      user_id: userID,
      product_id: productRes.id as number,
      qty: 1,
      note: null
    };

    const shoppingCart2: ShoppingCart = {
      user_id: userID,
      product_id: productRes2.id as number,
      qty: 10,
      note: null
    };

    const shoppingCartRes = await store.create(shoppingCart);
    shoppingCartID = shoppingCartRes.id as number;

    expect(shoppingCartRes.user_id).toEqual(shoppingCart.user_id);

    const shoppingCartRes2 = await store.create(shoppingCart2);

    expect(shoppingCartRes2.user_id).toEqual(shoppingCart2.user_id);
  });

  it('Should Return an Item from Shopping Cart', async (): Promise<void> => {
    const shoppingCartRes = await store.show(shoppingCartID, userID);

    expect(shoppingCartRes.id).toEqual(shoppingCartID);
  });

  it('Should Return All User Items in the Shopping Cart', async (): Promise<void> => {
    const shoppingCarts = await store.index(userID);

    const shoppingCart = await store.show(shoppingCartID, userID);

    expect(shoppingCarts).toContain(shoppingCart);
  });

  it('Should update Shopping Cart Item - Just QTY', async (): Promise<void> => {
    // UPDATING THE VALUE
    const shoppingCart: ShoppingCartUpdate = {
      id: shoppingCartID,
      user_id: userID,
      qty: 2
    };
    const shoppingCartRes = await store.update(shoppingCart);

    expect(shoppingCartRes.qty as number).toEqual(shoppingCart.qty as number);
  });

  it('Should Delete Shopping Cart Item', async (): Promise<void> => {
    const shoppingCartRes = await store.delete(shoppingCartID, userID);

    expect(shoppingCartRes.id).toEqual(shoppingCartID);
  });

  it('Should Empty Shopping Cart Item', async (): Promise<void> => {
    const shoppingCartRes = await store.empty(userID);

    expect(shoppingCartRes).toBeTruthy();
  });

  it('Should Truncate ShoppingCart Data', async (): Promise<void> => {
    const res = await store.truncate();

    expect(res).toBeTrue();
  });
});
