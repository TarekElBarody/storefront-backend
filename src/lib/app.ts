import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import fs from 'fs';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import session from './helpers/session';
import mainRoute from '../routes/mainRoute';
import forceHttps from './middleware/forceHttps';

// Configure express server & default port
dotenv.config();
const app = express();
const port = process.env.HTTP_PORT;
const sslPort = process.env.HTTPS_PORT;

if (process.env.SECURE == '1') {
  app.enable('trust proxy');
  app.use(forceHttps);
}

// Morgan HTTP request logger
app.use(
  morgan('combined', {
    stream: fs.createWriteStream('./logs/access.log', { flags: 'a' })
  })
);

// enable this if you want to show morgan log on consol
if (process.env.MORGAN == '1') {
  app.use(morgan('dev'));
}

// parsing incoming data
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// enable session
// configure session
const sess = {
  secret: String(process.env.SESSION_SLAT),
  cookie: {
    secure: process.env.SECURE == '1' ? true : false, // serve secure cookies
    maxAge: 5 * 60 * 100000
  },
  resave: false,
  saveUninitialized: true
};

app.use(session(sess));

// compress resources
app.use(compression());

// Make the server using Module helmet for protecting headers
app.use(helmet());

// Set up the allowed CORS Origins & CORS Options
app.use(cors());

// mount mainRoute to server root
app.use('/', mainRoute);

// Configure SSL Certificates
const sslCert = {
  key: fs.readFileSync('./cert/server.key'),
  cert: fs.readFileSync('./cert/server.cert')
};

export { app, port, sslPort, sslCert };
