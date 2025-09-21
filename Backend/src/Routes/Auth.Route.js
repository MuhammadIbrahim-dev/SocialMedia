import express from 'express' 
import { LoginController, SignupController, LogoutController, CheckController, getAllUsers } from '../controllers/authControllers/AuthController.js'
import { AdminMiddleware, AuthMiddleware } from '../middlerwares/authMiddleware.js'

const AuthRouter = express.Router()

AuthRouter.post('/signup',SignupController)
AuthRouter.post('/login', LoginController)
AuthRouter.post('/logout', LogoutController)
AuthRouter.get('/check-user', AuthMiddleware, CheckController)
AuthRouter.get('/users', AuthMiddleware, AdminMiddleware, getAllUsers)


export default AuthRouter