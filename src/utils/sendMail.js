import nodemailer from 'nodemailer'
import asyncHandler from 'express-async-handler'
import { env } from '~/config/environment'


export const sendMail = asyncHandler(async ({ email, html }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: env.EMAIL_NAME,
      pass: env.EMAIL_APP_PASSWORD
    }
  })

  const info = await transporter.sendMail({
    from: '"Trello" <no-reply@Trello.com>',
    to: email,
    subject: 'Forgot password',
    html: html
  })

  return info
})
