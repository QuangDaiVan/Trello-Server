import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xư lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      sluug: slugify(reqBody.title)
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    // Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án
    // Bắn email, notification về cho admin khi có 1 cái board mới được tạo

    // Phải có return để trả kết quả về
    return newBoard
  } catch (error) { throw error }
}

export const boardService = { createNew }