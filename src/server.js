/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'

const START_SERVER = () => {
  const app = express()

  // enable req.body data
  app.use(express.json())

  // use APIs v1
  app.use('/v1', APIs_V1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hello ${env.AUTHOR}, Back-end server is running at http://${env.APP_HOST}:${env.APP_PORT}`)
  })

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

