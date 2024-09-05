import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xư lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard)
    // console.log(createdBoard.insertedId)

    // lấy bản ghi board sau khi gọi (tùy mục đích mà dự án cần có bước này hay không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // console.log(getNewBoard)

    // Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án
    // Bắn email, notification về cho admin khi có 1 cái board mới được tạo

    // Phải có return để trả kết quả về
    return getNewBoard
  } catch (error) { throw error }
}

const getDetails = async (boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    const board = await boardModel.getDetails(boardId)

    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    // Bước 1: deep clone board  là tạo ra 1 cái mới để xử lý, không ảnh hưởng tới board ban đầu
    // tùy mục đích về sau mà có cần clone hay không
    const resBoard = cloneDeep(board)

    // Bước 2: đưa card về đúng column của nó
    resBoard.columns.forEach(column => {
      // Cách 1: dùng .equals do ObjectId trong MongoDB có support method .equals
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))

      // Cách 2: convert ObjectId về string bằng hàm toString() của javascript
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })

    // Bước 3: xóa mảng cards khỏi board ban đầu
    delete resBoard.cards

    // Phải có return để trả kết quả về
    return resBoard
  } catch (error) { throw error }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) { throw error }
}

export const boardService = { createNew, getDetails, update }