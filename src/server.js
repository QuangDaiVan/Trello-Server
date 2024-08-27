/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'

const START_SERVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8017

  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray())
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(port, hostname, () => {
    console.log(`3. Hello, I am running at http://${hostname}:${port}`)
  })

  // thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log('4.')
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

