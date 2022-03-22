import supertest from 'supertest';
import dotenv from 'dotenv';
import { httpApp, httpsApp, sslCert } from '../../server';
import { Category, SignedToken, User, UserRoles } from '../../types/index';
import { dateNow } from '../../lib/functions/general';
import { createToken } from '../../lib/functions/hash';
import UserStore from '../../models/userStore';
import CategoryStore from '../../models/categoryStore';

dotenv.config();
// prepare server for testing
const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

const created = dateNow();
let resCategory: Category;
let signedToken: SignedToken;

describe('Test Categories Handlers EndPoint (categoriesHandlerSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    const userStore = new UserStore();
    await userStore.truncate();

    const productStore = new CategoryStore();
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
  });

  it('Should Generated Admin Token Success', async (): Promise<void> => {
    expect(signedToken.success).toBeTruthy();
  });

  it('Should Endpoint Insert New Categories', async (): Promise<void> => {
    const category: Category = {
      name: 'Laptops',
      parent: 0,
      icon: '/assets/icons/phone-icon.png',
      created: created
    };

    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .post('/api/categories/add')
        .send(category)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .post('/api/categories/add')
        .send(category)
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    resCategory = res.body as Category;

    expect(res.status).toBe(201);
    expect(resCategory.name).toEqual(category.name);
  });

  it('Should Endpoint Get All Categories', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api/categories')
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get('/api/categories')
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    const categories = res.body as Category[];

    expect(res.status).toBe(200);
    expect(categories).toContain(resCategory);
  });

  it('Should Endpoint Get Category Data', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api/categories/' + resCategory.id)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get('/api/categories/' + resCategory.id)
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    const category = res.body as Category;

    expect(res.status).toBe(200);
    expect(category).toEqual(resCategory);
  });

  it('Should Endpoint Update Categories Data', async (): Promise<void> => {
    const updateCategory = {
      name: 'Workstations'
    };
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .put('/api/categories/' + resCategory.id)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .send(updateCategory)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .put('/api/categories/' + resCategory.id)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .send(updateCategory);
    }
    const category = res.body as Category;

    expect(res.status).toBe(200);

    resCategory.name = 'Workstations';

    expect(category).toEqual(resCategory);
  });

  it('Should Endpoint Delete Categories Data', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .delete('/api/categories/' + resCategory.id)
        .set('Authorization', `Bearer ${signedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .delete('/api/categories/' + resCategory.id)
        .set('Authorization', `Bearer ${signedToken.token}`);
    }
    const category = res.body as Category;

    expect(res.status).toBe(200);

    expect(category).toEqual(resCategory);
  });

  it('Should Endpoint Error Category Require Token', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .put('/api/categories/' + resCategory.id)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp.put('/api/categories/' + resCategory.id);
    }

    expect(res.status).toBe(401);
  });
});
