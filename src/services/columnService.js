import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
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

export const columnService = { createNew }