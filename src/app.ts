import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { userRoutes } from './app/modules/User/user.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { blogRoutes } from './app/modules/Blog/blog.route';

const app: Application = express();

//parser
app.use(cors());
app.use(express.json());

// root api
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from server!!!!!');
});

app.use('/api/auth', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', blogRoutes);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
