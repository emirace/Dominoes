import { Router } from 'express';
import UserController from '../controllers/User.controller';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// router.post('/register', UserController.register);
// router.post('/login', UserController.login);
router.post('/auth', UserController.authenticate);
router.get('/me', authMiddleware, UserController.getLoggedInUser);
router.get('/:id', UserController.getUser);

export default router;
