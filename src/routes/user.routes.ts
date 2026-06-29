import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

export const userRouter = Router();

userRouter.use(requireAuth);

userRouter.get('/me', userController.me);
userRouter.get('/', requireAdmin, userController.listUsers);
userRouter.patch('/:id', requireAdmin, userController.updateUser);
userRouter.delete('/:id', requireAdmin, userController.deleteUser);