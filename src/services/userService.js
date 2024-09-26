import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { userModel } from '~/models/userModel'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const register = async (reqBody) => {
  const existingUser = await userModel.findByEmail(reqBody.email)
  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already in use')
  }

  const newUser = { ...reqBody }
  const createdUser = await userModel.createNew(newUser)
  const getNewUser = await userModel.findOneById(createdUser.insertedId)
  return getNewUser
}

// const login = async (email, password) => {
//   const user = await userModel.findByEmail(email)
//   if (!user) {
//     throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password)
//   if (!isPasswordValid) {
//     throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
//   }

//   const token = jwt.sign({ userId: user._id }, env.JWT_SCRETE, { expiresIn: '1d' })
//   return { token, user: { _id: user._id, email: user.email, username: user.username } }
// }

export const userService = { register }