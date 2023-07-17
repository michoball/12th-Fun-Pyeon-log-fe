import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import LoginModal from '@components/LoginModal/LoginModal'
import FunButton from '@components/styles/FunButton'
import Spinner from '@components/styles/Spinner'
import { googleSignOut, auth } from '@services/firebaseAuth'
import {
  getUserSession,
  logOutUserThunk,
  userLoadingSelect,
  userSelect,
} from '@stores/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import { onAuthStateChanged } from 'firebase/auth'

import { ReactComponent as Funlogo } from '../../assets/funlog.svg'
import {
  NavCon,
  LogoCon,
  Avatar,
  LogoutCon,
  LoadingContainer,
} from './Navigation.styles'

const Navigation = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector(userSelect)
  const loading = useAppSelector(userLoadingSelect)
  const [modalOpen, setModalOpen] = useState(false)

  const signOutHandler = () => {
    if (user) {
      googleSignOut()
      dispatch(logOutUserThunk())
    }
    navigate('/', { replace: true })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken()
        dispatch(getUserSession(token))
      }
    })
    return unsubscribe
  }, [dispatch])

  return (
    <>
      <NavCon>
        <LogoCon>
          <Funlogo
            onClick={() => {
              navigate('/')
            }}
          />
        </LogoCon>

        {loading ? (
          <LoadingContainer>
            <Spinner />
          </LoadingContainer>
        ) : user ? (
          <LogoutCon>
            <Avatar>
              <img src={user.imgUrl} alt="user avatar" />
            </Avatar>
            <p>{user.displayName}</p>
            <FunButton onClick={signOutHandler}>Logout</FunButton>
          </LogoutCon>
        ) : (
          <FunButton
            onClick={() => {
              setModalOpen(true)
            }}
          >
            Login
          </FunButton>
        )}
        {modalOpen && <LoginModal setModalOpen={setModalOpen} />}
      </NavCon>

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Navigation
