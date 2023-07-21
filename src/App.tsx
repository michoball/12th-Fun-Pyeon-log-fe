import React, { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { setUserPosition, userPositionSelect } from '@stores/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import { DEFAULT_KAKAO_COORD } from '@utils/constants'
import { routers } from '@pages/routes'

function App() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const dispatch = useAppDispatch()
  const userPosition = useAppSelector(userPositionSelect)

  useEffect(() => {
    if (userPosition) return
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude // 위도
        const lng = position.coords.longitude // 경도
        dispatch(setUserPosition({ lat, lng }))
      },
      () => {
        alert('위치 정보 제공에 동의하지 않을 시 사용자의 위치는 서울역입니다.')
        const lat = DEFAULT_KAKAO_COORD.lat
        const lng = DEFAULT_KAKAO_COORD.lng
        dispatch(setUserPosition({ lat, lng }))
      }
    )
  }, [userPosition, dispatch])

  useEffect(() => {
    // API 스크립트 로드
    if (!isScriptLoaded) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=d25f19cf0a1860dd105275f8a970b86d&libraries=services&autoload=false`

      script.onload = () => {
        setIsScriptLoaded(true)
      }
      if (!document.querySelector(`script[src="${script.src}"]`)) {
        document.body.appendChild(script)
      }
    }
  }, [isScriptLoaded])

  if (!isScriptLoaded) {
    return <></>
  }
  return <RouterProvider router={routers} />
}

export default App
