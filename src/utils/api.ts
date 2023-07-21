import axios, { AxiosError } from 'axios'

export const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

const errorController = (error: AxiosError) => {
  const status = error.response?.status

  if (status === 401) {
    return '값이 잘못되었습니다.'
  } else if (status === 401) {
    return '토큰 값이 유효하지 않습니다.'
  } else if (status === 404) {
    return '리뷰가 존재하지 않습니다.'
  } else if (status === 403) {
    return '작성한 유저가 아닙니다.'
  }

  return error.message
}

api.interceptors.request.use((config) => {
  config.withCredentials = true
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message = errorController(error)
      return message
    }
    return error
  }
)
