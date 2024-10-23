/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {
  const app = express()
  //abc
  // xử lý CORS
  app.use(cors(corsOptions))

  // enable req.body data
  app.use(express.json())

  app.use(cookieParser())

  // use APIs v1
  app.use('/v1', APIs_V1)

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  // môi trường production (đang deploy bằng render)
  // môi tường local dev
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Local DEV: Hello ${env.AUTHOR}, Back-end server is running successfully at Host:${env.APP_HOST} and Port:${env.APP_PORT}`)
  })

  // if (env.BUILD_MODE === 'production') {
  //   app.listen(process.env.PORT, () => {
  //     console.log(`3. Production: Hello ${env.AUTHOR}, Back-end server is running successfully at Port ${env.PORT}`)
  //   })
  // } else {
  //   // môi tường local dev
  //   app.listen(env.APP_PORT, env.APP_HOST, () => {
  //     console.log(`3. Local DEV: Hello ${env.AUTHOR}, Back-end server is running successfully at Host: ${env.APP_HOST} and Port: ${env.APP_PORT}`)
  //   })
  // }

  // thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    CLOSE_DB()
  })
}

// IIFE: Immediately Invoked Function Expression: hàm thực thi ngay sau khi đc định nghĩa
// chỉ khi kết nối tới Database thành công thì mới start server backend lên
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas')

    // khởi động server back-end sau khi đã connect database thành công
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// // chỉ khi kết nối tới Database thành công thì mới start server backend lên
// console.log('1. Connecting to MongoDB Cloud Atlas...')

// // viết theo dạng promise
// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Cloud Atlas'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })

