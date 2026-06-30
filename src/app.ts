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

// Only listen locally; on Vercel, app is handled by the platform
if (process.env.NODE_ENV !== 'production') {
  app.listen(env.port, () => {
    console.log(`API running on port ${env.port}`);
  });
}

export default app;