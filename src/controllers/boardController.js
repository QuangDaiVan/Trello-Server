import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang tầng service
    const createdBoard = await boardService.createNew(req.body)

    // có kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) { next(error) }
}

export const boardController = { createNew }
