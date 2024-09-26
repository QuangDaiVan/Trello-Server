import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.post('/register', userValidation.createNew, userController.register)

export const userRoute = Router