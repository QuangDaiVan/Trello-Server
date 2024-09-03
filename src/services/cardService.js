import { cardModel } from '~/models/cardModel'
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
    return getNewCard
  } catch (error) { throw error }
}


export const cardService = { createNew }