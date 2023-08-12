import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { userRouter } from './routers/user.router.js';
import createDebug from 'debug';
import { errorHandler } from './middleware/error.js';
import { nudibranchRouter } from './routers/nudibranch.router.js';
const debug = createDebug('NB:App');

export const app = express();

debug('Loaded Express App');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.send('NUDIBRANCHS');
});

app.use('/user', userRouter);
app.use('/nudibranch', nudibranchRouter);

app.use(errorHandler);
