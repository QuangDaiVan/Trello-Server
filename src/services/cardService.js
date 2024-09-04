import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    // xủ lý logic dữ liệu tùy đặc thù dự án
    const newCard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    // Xử lý ...
    if (getNewCard) {
      // cập nhật mảng cardOrderIds trong collection columns
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) { throw error }
}

export const cardService = { createNew }