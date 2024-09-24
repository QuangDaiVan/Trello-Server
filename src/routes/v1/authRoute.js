import express from 'express'
import { authController } from '~/controllers/authController'

const Router = express.Router()

Router.post('/register', authController.register)
Router.post('/login', authController.login)

export const authRoute = Router