import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const result = await userService.login(email, password)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const userController = { register, login }