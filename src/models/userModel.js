import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'


const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().required().min(3).max(50).trim().strict(),
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().required().min(8).max(100),
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


export const userModel = { USER_COLLECTION_NAME, USER_COLLECTION_SCHEMA, createNew, findByEmail, findOneById }