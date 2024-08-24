const MONGODB_URI = 'mongodb+srv://quangdv2802:13yEyvXEnKh7jqyy@cluster-quangdaivan.s2nax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-QuangDaiVan'
const DATABASE_NAME = 'trello-quangdv-MERN-stackpro'


import { MongoClient, ServerApiVersion } from 'mongodb'

// khởi tạo 1 đối tượng trelloDatabaseInstance ban đầu là null vì hiện chưa connect
let trelloDatabaseInstance = null

// khởi tạo 1 đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(MONGODB_URI, {
  // lưu ý: cái serverApi có từ phiên bản MongoDB 5.0.0 trở lên, có thể không cần dùng nó
  // nếu dùng nó thì cần chỉ định 1 cái stable API Version của MongoDB
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  // gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của mongoClientInstance
  await mongoClientInstance.connect()

  // kết nối thành công thì lấy ra Database theo tên và gán ngược nó lại vào biến trelloDatabaseInstance ở trên
  trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)
}

// function GET_DB (ko async) có nhiệm vụ export ra cái Trello Database Instance sau khi đã connect thành công tới MongoDB để chúng ta sử dụng ở nhiều nơi khác nhau trong code
// lưu ý phải đảm bảo chỉ luôn gọi hàm GET_DB này sau khi đã kết nối thành công tới MongoDB
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first!')
  return trelloDatabaseInstance
}