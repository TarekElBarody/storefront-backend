import supertest from 'supertest';
import { httpApp, httpsApp, sslCert } from '../../../server';

const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

describe('Test Web Route Access (webRouteSpec)', () => {
  it('Should Web Front is Responding', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/')
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp.get('/');
    }

    expect(res.status).toBe(200);
  });
});
