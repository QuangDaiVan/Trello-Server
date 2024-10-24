import bcrypt from 'bcryptjs'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { generateAccsessToken, generateRefreshToken } from '~/middlewares/jwt'
import { sendMail } from '~/utils/sendMail'
import { env } from '~/config/environment'


const register = async (reqBody) => {
  const existingUser = await userModel.findByEmail(reqBody.email)
  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already in use')
  }

  const createdUser = await userModel.createNew(reqBody)
  const getNewUser = await userModel.findOneById(createdUser.insertedId)
  return getNewUser
}

const login = async (email, password) => {
  const user = await userModel.findByEmail(email)
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (user && isPasswordValid) {
    const accessToken = generateAccsessToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)
    await userModel.pushTokenIntoUser(user._id, newRefreshToken)

    const { password, refreshToken, ...userData } = user
    return {
      accessToken: accessToken,
      refreshToken: newRefreshToken,
      user: userData
    }
  } else {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
  }
}

const logout = async (token) => {
  const user = await userModel.deleteRefreshToken(token)
  return { user: user }
}

const getCurrent = async (id) => {
  return await userModel.findOneById(id)
}

const forgotPassword = async (email) => {
  const user = await userModel.findByEmail(email)
  if (!user) {
    throw new Error('User not found!')
  }
  const resetToken = await userModel.createPasswordChangeToken(user)
  // gửi mail
  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
      <a href=${env.URL_SERVER}/v1/user/resetPassword/${resetToken}>Click here</a>`

  const data = {
    email,
    html
  }
  const result = await sendMail(data)
  return result
}

const resetPassword = async (password, token) => {
  const user = await userModel.resetPassword(password, token)
  return user
}

const updateUser = async (id, reqBody) => {
  const user = await userModel.updateUser(id, reqBody)
  return user
}

export const userService = { register, login, logout, getCurrent, forgotPassword, resetPassword, updateUser }