import express from 'express';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Express 5 forwards errors from async handlers to errorHandler, so no try/catch wrapper is needed.
const app = express();

app.use(express.json());
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
