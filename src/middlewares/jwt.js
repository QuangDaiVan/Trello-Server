import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

export const generateAccsessToken = (uid) => {
  return jwt.sign({ _id: uid }, env.JWT_SECRET, { expiresIn: '2d' })
}

export const generateRefreshToken = (uid) => {
  return jwt.sign({ _id: uid }, env.JWT_SECRET, { expiresIn: '7d' })
}

