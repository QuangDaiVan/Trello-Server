/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  // mặc định phía BE ko cần phải custom message vì trước đó phía FE đã tự validate và custom message phía FE cho đẹp
  // BE chỉ cần validate đảm bảo dữ liệu chuẩn xác và trả về message mặc định từ thư viện là được
  // quan trọng: việc validate dư liệu là bắt buộc phải có ở phía BE vì đây là điểm cuối để lưu trữ dữ liệu và Database
  // và trong thực tế thì điều tốt nhất cho hệ thống là luôn validate dữ liệu ở cả FE và BE

  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required (QuangDaiVan)',
      'sring.empty': 'Title is not allowed to be empty (QuangDaiVan)',
      'sring.min': 'Title is min 3 chars (QuangDaiVan)',
      'sring.max': 'Title is max 50 chars (QuangDaiVan)',
      'sring.trim': 'Title must not have leading or trailing whitespace (QuangDaiVan)'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })

  try {

    // chỉ định thêm abortEarly:false - để hiển thị ra tất cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Validate dữ liệu xong xuôi và hợp lệ thì cho request đi đến controller
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }

}

const update = async (req, res, next) => {
  // mặc định phía BE ko cần phải custom message vì trước đó phía FE đã tự validate và custom message phía FE cho đẹp
  // BE chỉ cần validate đảm bảo dữ liệu chuẩn xác và trả về message mặc định từ thư viện là được
  // quan trọng: việc validate dư liệu là bắt buộc phải có ở phía BE vì đây là điểm cuối để lưu trữ dữ liệu và Database
  // và trong thực tế thì điều tốt nhất cho hệ thống là luôn validate dữ liệu ở cả FE và BE

  const correctCondition = Joi.object({
    // lưu ý: không dùng required trong trường hợp update
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {

    // chỉ định thêm abortEarly:false - để hiển thị ra tất cả lỗi
    // đối với trường hợp update, cho phép unknown để không cần đẩy 1 số field lên
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }

}

const moveCardToDifferentColumn = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array().required().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),
    nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array().required().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {

    // chỉ định thêm abortEarly:false - để hiển thị ra tất cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }

}


export const boardValidation = { createNew, update, moveCardToDifferentColumn }