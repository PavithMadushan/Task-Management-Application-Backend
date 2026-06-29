import express from 'express';
import cors from 'cors';
import { env } from '@config/env';
import { apiRouter } from '@routes/index';
import { errorHandler } from '@middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API running on port ${env.port}`);
});