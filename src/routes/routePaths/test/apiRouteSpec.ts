import supertest from 'supertest';
import { httpApp, httpsApp, sslCert } from '../../../server';
import dotenv from 'dotenv';

dotenv.config();
const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

describe('Test API Endpoints Access (apiRouteSpec)', () => {
  it('Should Endpoint is Responding 200 With Json', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api')
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp.get('/api');
    }

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message:
        'This is the API main page .. please read the API documentation for more help'
    });
  });

  it('Should API Return error 404 Not found for not controlled endpoint', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api/WrongStatement')
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp.get('/api/WrongStatement');
    }

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: 'API Page Not Found !.'
    });
  });
});
