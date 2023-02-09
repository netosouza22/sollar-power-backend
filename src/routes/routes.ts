import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ProjectController } from '../controllers/ProjectController';
import { UserController } from '../controllers/UserController';
import { verifyToken } from '../middleware/auth';

const routes = Router();

//auth routes
routes.post('/login', new AuthController().login)
routes.post('/checkAuth', new AuthController().checkTokenValidation)

//users routes
routes.post('/users', verifyToken, new UserController().create)
routes.get('/users', verifyToken, new UserController().getAll)
routes.get('/users/:userId', verifyToken, new UserController().get)
routes.put('/users/:userId', verifyToken, new UserController().update)
routes.delete('/users/:userId', verifyToken, new UserController().delete)

//users routes
routes.post('/projects/:userId', verifyToken, new ProjectController().create)
routes.get('/projects', verifyToken, new ProjectController().getAll)
routes.get('/projects/:projectId', verifyToken, new ProjectController().get)
routes.put('/projects/:projectId', verifyToken, new ProjectController().update)
routes.delete('/projects/:projectId', verifyToken, new ProjectController().delete)
routes.get('/projects/state/:state', verifyToken, new ProjectController().getPerState)

export default routes;