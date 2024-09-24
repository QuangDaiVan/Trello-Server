import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers['Authorization']
//   const token = authHeader && authHeader.split(' ')[1]

//   if (!authHeader || !authHeader.startsWith('Bearer ') || !token) {
//     return next(new ApiError(StatusCodes.UNAUTHORIZED, 'No token provided or invalid token format'))
//   }

//   try {
//     const decoded = jwt.verify(token, env.JWT_SCRETE)
//     req.userId = decoded.userId
//     next()
//   } catch (error) {
//     next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token'))
//   }
// }

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'No token provided'))
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SCRETE)
    req.userId = decoded.userId
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token'))
  }
}