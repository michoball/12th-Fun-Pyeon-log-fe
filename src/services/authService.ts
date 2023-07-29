import { api } from '@utils/api'

type SignInParam = string

interface UserDTO {
  email: string
  userImageUrl: string
}

const signIn = async (token: SignInParam) => {
  const response = await api.get('/api/users/me', {
    headers: { Authorization: `${token}` },
    withCredentials: true,
  })
  return response.data as UserDTO
}

const signOut = async () => {
  const response = await api.delete('/api/users/me', {
    withCredentials: true,
  })
  return response
}

const AuthService = { signIn, signOut }

export default AuthService
