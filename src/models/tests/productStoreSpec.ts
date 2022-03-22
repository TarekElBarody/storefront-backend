import ProductStore from '../productStore';
import CategoryStore from '../categoryStore';
import { Product, ProductUpdate, Category } from '../../types/index';
import { dateNow } from '../../lib/functions/general';

let productID = 0;
const created = dateNow();
const store = new ProductStore();
let categoryID = 0;

describe('Test Product Model (productStoreSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    await store.truncate();

    const categoryStore = new CategoryStore();
    await categoryStore.truncate();
    const category: Category = {
      name: 'Phones',
      parent: 0,
      icon: '/assets/icons/phone-icon.png',
      created: created
    };

    const categoryRes = await categoryStore.create(category);
    categoryID = Number(categoryRes.id);
  });

  it('Should Product Model CRUD functions are defined', async (): Promise<void> => {
    expect(store.create).toBeDefined();
    expect(store.index).toBeDefined();
    expect(store.show).toBeDefined();
    expect(store.view).toBeDefined();
    expect(store.update).toBeDefined();
    expect(store.delete).toBeDefined();
    expect(store.truncate).toBeDefined();
  });

  it('Should Insert New Product', async (): Promise<void> => {
    const product: Product = {
      name: 'Apple iPhone 13 Pro Max with FaceTime - 256GB, 6GB RAM, 4G LTE, Sierra Blue, Single SIM & E-SIM',
      description: `6.7-inch Super Retina XDR display with ProMotion for a faster, more responsive feel
      Cinematic mode adds shallow depth of field and shifts focus automatically in your videos
      Pro camera system with new 12MP Telephoto, Wide, and Ultra Wide cameras; LiDAR Scanner; 6x optical zoom range; macro photography; Photographic Styles, ProRes video, Smart HDR 4, Night mode, Apple ProRAW, 4K Dolby Vision HDR recording
      12MP TrueDepth front camera with Night mode, 4K Dolby Vision HDR recording
      A15 Bionic chip for lightning-fast performance`,
      category_id: categoryID,
      price: 24299.0,
      stock: 5,
      details: {
        items: [
          { name: 'OS', value: 'IOS 14' },
          { name: 'RAM', value: '256 GB' },
          {
            name: 'Package Dimensions',
            value: '17.8 x 9.5 x 2.9 cm; 200 Grams'
          },
          {
            name: 'Batteries',
            value: '1 Lithium ion batteries required. (included)'
          },
          { name: 'Item model number', value: 'MLJD3J/A' },
          { name: 'Other display features', value: 'Wireless' },
          { name: 'Form factor', value: 'Slider' },
          { name: 'Color', value: 'Sierra Blue' },
          { name: 'Battery Power Rating', value: '4250' },
          { name: 'Whats in the box', value: 'USB Cable' },
          { name: 'Item Weight', value: '200 g' }
        ]
      },
      image: 'assets/images/products/01.jpg',
      status: 1,
      created: created
    };

    const productRes = await store.create(product);
    productID = Number(productRes.id);

    expect(productRes.name).toBe(product.name);
    expect(productID).toBeGreaterThan(0);
  });

  it('Should Return Product Data', async (): Promise<void> => {
    const productRes = await store.show(productID);

    expect(productRes.id).toEqual(productID);
  });

  it('Should Return Product View', async (): Promise<void> => {
    const productRes = await store.view(productID);

    expect(productRes.id).toEqual(productID);
  });

  it('Should Return All Product Data', async (): Promise<void> => {
    const products = await store.index();

    const product = await store.show(productID);

    expect(products).toContain(product);
  });

  it('Should update Product - Just Price', async (): Promise<void> => {
    // UPDATING THE VALUE
    const product: ProductUpdate = {
      id: productID,
      price: 26999.999
    };
    const productRes = await store.update(product);

    expect(productRes.price as number).toEqual(product.price as number);
  });

  it('Should Delete Product Data', async (): Promise<void> => {
    const productRes = await store.delete(productID);

    expect(productRes.id).toEqual(productID);
  });

  it('Should Truncate Product Data', async (): Promise<void> => {
    const res = await store.truncate();

    expect(res).toBeTrue();
  });
});
