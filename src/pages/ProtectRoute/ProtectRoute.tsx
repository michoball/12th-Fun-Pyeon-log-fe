import React from 'react'
import { Navigate } from 'react-router-dom'
import { userSelect } from '@stores/auth/authSlice'
import { useAppSelector } from '@stores/store'

const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector(userSelect)
  if (!user) {
    alert('로그인 후 이용 가능합니다.')
    return <Navigate to="/" />
  }
  return <>{children}</>
}

export default ProtectRoute
