import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import crypto from 'crypto'


const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().required().min(3).max(50).trim().strict(),
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().required().min(8).max(100),
  refreshToken: Joi.string(),
  passwordResetToken: Joi.string(),
  passwordResetExpires: Joi.date().timestamp('javascript'),
  passwordChangeAt: Joi.date().timestamp('javascript'),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})


const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const hashedPassword = await bcrypt.hash(validData.password, 10)
    const newUser = {
      ...validData,
      password: hashedPassword
    }
    const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(newUser)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findByEmail = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: email })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    // console.log(id)
    // console.log(new ObjectId(id))
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const pushTokenIntoUser = async (id, token) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { refreshToken: token } },
      { ReturnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteRefreshToken = async (token) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate({ refreshToken: token }, { $set: { refreshToken: '' } })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const createPasswordChangeToken = async (user) => {
  try {
    const resetToken = crypto.randomBytes(32).toString('hex')
    await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(user._id) },
      {
        $set: {
          passwordResetToken: crypto.createHash('sha256').update(resetToken).digest('hex'),
          passwordResetExpires: Date.now() + 15 * 60 * 1000
        }
      },
      { ReturnDocument: 'after' }
    )
    return resetToken
  } catch (error) {
    throw new Error(error)
  }
}

const resetPassword = async (password, token) => {
  const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
    { passwordResetToken, passwordResetExpires: { $gt: Date.now() } },
    {
      $set: {
        password: hashedPassword,
        passwordResetToken: undefined,
        passwordChangeAt: Date.now(),
        passwordResetExpires: undefined
      }
    },
    { ReturnDocument: 'after' }
  )
  return user
}

const updateUser = async (id, reqBody) => {
  console.log(Object.keys(reqBody))
  const user = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: { username: reqBody.username }
    },
    { ReturnDocument: 'after' }
  )
  console.log(user)
  return user

}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findByEmail,
  findOneById,
  pushTokenIntoUser,
  deleteRefreshToken,
  createPasswordChangeToken,
  resetPassword,
  updateUser
}