import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'
import { verifyAccessToken } from '~/middlewares/verifyToken'

const Router = express.Router()

Router.post('/register', userValidation.createNew, userController.register)
Router.post('/login', userValidation.login, userController.login)
Router.get('/logout', userController.logout)
Router.get('/forgotPassword', userController.forgotPassword)
Router.get('/current', [verifyAccessToken], userController.getCurrent)
Router.put('/resetPassword', userController.resetPassword)
Router.put('/update', [verifyAccessToken], userController.updateUser)

export const userRoute = Router