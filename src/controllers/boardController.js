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

const getDetails = async (req, res, next) => {
  try {
    // lấy ra boardId từ request
    const boardId = req.params.id

    // điều hướng dữ liệu sang tầng service
    const Board = await boardService.getDetails(boardId)

    // có kết quả thì trả về phía Client
    res.status(StatusCodes.OK).json(Board)
  } catch (error) { next(error) }
}

export const boardController = { createNew, getDetails }
