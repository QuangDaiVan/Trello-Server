import { columnModel } from '~/models/columnModel'
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
    return getNewColumn
  } catch (error) { throw error }
}


export const columnService = { createNew }