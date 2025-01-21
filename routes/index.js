// routes/index.js

import { Router } from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController.js';
import FilesController from '../controllers/FilesController.js';

const router = Router();

// Define routes
router.get('/stats', AppController.getStats); 
router.get('/status', AppController.getStatus); // Get app status
router.post('/users', UsersController.postNew); // Create new user
router.get('/connect', AuthController.getConnect); // Login user
router.get('/disconnect', AuthController.getDisconnect); // Logout user
router.get('/users/me', UsersController.getMe); // Get current user info

export default router;
