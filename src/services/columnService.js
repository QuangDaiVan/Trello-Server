import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    // xủ lý logic dữ liệu tùy đặc thù dự án
    const newColumn = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    // Xử lý ...
    if (getNewColumn) {
      // xử lý cấu trúc data ở đây trước khi trả dữ liệu về
      getNewColumn.cards = []

      // cập nhật mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) { throw error }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  } catch (error) { throw error }
}

const deleteItem = async (columnId) => {
  try {
    // xóa column
    await columnModel.deleteOneById(columnId)
    // xóa toàn bộ card thuộc column trên
    await cardModel.deleteManyByColumnId(columnId)

    return { deleteResult: 'Column and its Cards deleted successfully' }
  } catch (error) { throw error }
}


export const columnService = { createNew, update, deleteItem }