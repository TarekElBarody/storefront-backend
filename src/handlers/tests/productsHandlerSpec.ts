import supertest from 'supertest';
import dotenv from 'dotenv';
import { httpApp, httpsApp, sslCert } from '../../server';
import {
  Product,
  ProductInsert,
  SignedToken,
  User,
  UserRoles,
  Category
} from '../../types/index';
import { dateNow } from '../../lib/functions/general';
import { createToken } from '../../lib/functions/hash';
import UserStore from '../../models/userStore';
import ProductStore from '../../models/productStore';
import CategoryStore from '../../models/categoryStore';

dotenv.config();
// prepare server for testing
const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

const created = dateNow();
let resProduct: Product;
let categoryID = 0;
let signedToken: SignedToken;

describe('Test Products Handlers EndPoint (productsHandlerSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    const userStore = new UserStore();
    await userStore.truncate();

    const categoryStore = new CategoryStore();
    await categoryStore.truncate();

    const productStore = new ProductStore();
    await productStore.truncate();

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

    const category: Category = {
      name: 'Phones',
      parent: 0,
      icon: '/assets/icons/phone-icon.png',
      created: created
    };

    const categoryRes = await categoryStore.create(category);
    categoryID = Number(categoryRes.id);
  });

  it('Should Generated Admin Token Success', async (): Promise<void> => {
    expect(signedToken.success).toBeTruthy();
  });

  it('Should Endpoint Insert New Products', async (): Promise<void> => {
    const product: ProductInsert = {
      name: 'Apple iPhone 13 Pro Max with FaceTime - 256GB, 6GB RAM, 4G LTE, Sierra Blue, Single SIM & E-SIM',
      description: `6.7-inch Super Retina XDR display with ProMotion for a faster, more responsive feel
        Cinematic mode adds shallow depth of field and shifts focus automatically in your videos
        Pro camera system with new 12MP Telephoto, Wide, and Ultra Wide cameras; LiDAR Scanner; 6x optical zoom range; macro photography; Photographic Styles, ProRes video, Smart HDR 4, Night mode, Apple ProRAW, 4K Dolby Vision HDR recording
        12MP TrueDepth front camera with Night mode, 4K Dolby Vision HDR recording
        A15 Bionic chip for lightning-fast performance`,
      category_id: categoryID,
      price: 24299.0,
      stock: 5,
      details: JSON.stringify({
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
      }),
      image: 'assets/images/products/01.jpg',
      status: 1,
      created: created
    };

    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .post('/api/products/add')
        .send(product)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .post('/api/products/add')
        .send(product)
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    resProduct = res.body as Product;

    expect(res.status).toBe(201);
    expect(resProduct.name).toEqual(product.name);
  });

  it('Should Endpoint Get All Products', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api/products')
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get('/api/products')
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    const products = res.body as Product[];

    expect(res.status).toBe(200);
    expect(products).toContain(resProduct);
  });

  it('Should Endpoint Get Product Data', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api/products/' + resProduct.id)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get('/api/products/' + resProduct.id)
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    const product = res.body as Product;

    expect(res.status).toBe(200);
    expect(product).toEqual(resProduct);
  });

  it('Should Endpoint Update Products Data', async (): Promise<void> => {
    const updateProduct = {
      price: 26999.999
    };
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .put('/api/products/' + resProduct.id)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .send(updateProduct)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .put('/api/products/' + resProduct.id)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .send(updateProduct);
    }
    const product = res.body as Product;

    expect(res.status).toBe(200);

    resProduct.price = updateProduct.price;

    expect(product.price as number).toEqual(resProduct.price as number);
  });

  it('Should Endpoint Delete Products Data', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .delete('/api/products/' + resProduct.id)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .delete('/api/products/' + resProduct.id)
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    const product = res.body as Product;

    expect(res.status).toBe(200);

    expect(product).toEqual(resProduct);
  });

  it('Should Endpoint Error Product Require Token', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .put('/api/products/' + resProduct.id)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp.put('/api/products/' + resProduct.id);
    }

    expect(res.status).toBe(401);
  });
});
