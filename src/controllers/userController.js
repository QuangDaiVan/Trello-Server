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
    const { refreshToken, ...data } = result
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.status(StatusCodes.OK).json(data)
  } catch (error) { next(error) }
}

const logout = async (req, res, next) => {
  try {
    const cookie = req.cookies
    await userService.logout(cookie.refreshToken)
    res.clearCookie('refreshToken', { httpOnly: true, secure: true })
    res.status(StatusCodes.OK).json('Logout is done')
  } catch (error) { next(error) }
}

const getCurrent = async (req, res, next) => {
  try {
    const user = await userService.getCurrent(req.user._id)
    res.status(StatusCodes.OK).json({
      success: true,
      result: user
    })
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.query
    const user = await userService.forgotPassword(email)
    res.status(StatusCodes.OK).json({
      success: true,
      result: user
    })
  } catch (error) {
    next(error)
  }

}

const resetPassword = async (req, res, next) => {
  try {
    const { password, token } = req.body
    if (!password || !token) { throw new Error('Missing inputs') }
    const user = await userService.resetPassword(password, token)
    res.status(StatusCodes.OK).json({
      success: true,
      result: user
    })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) { throw new Error('Missing inputs') }
    const response = await userService.updateUser(_id, req.body)
    return res.status(200).json({
      success: response ? true : false,
      result: response ? response : 'Something went wrong'
    })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  register,
  login,
  logout,
  getCurrent,
  forgotPassword,
  resetPassword,
  updateUser
}