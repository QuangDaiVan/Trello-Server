// những domain được phép truy cập tới tài nguyên của Server
export const WHITELIST_DOMAINS = [
  // không cần localhost nữa vì ở file config/cors đã luôn luôn cho phép môi trường dev
  'http://localhost:5173',
  'http://172.18.56.126:5173'
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}