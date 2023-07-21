import React, { useCallback, useEffect, useRef } from 'react'
import Tooltip from '@components/tooltip/Tooltip'

import { searchedCoordSelect } from '@stores/sort/sortSlice'
import { useAppSelector } from '@stores/store'
import { DEFAULT_KAKAO_COORD } from '@utils/constants'
import { useKakaoMap } from 'hooks/MapContext'

import { MapViewer } from './Map.styles'

const Map = () => {
  const isMapMounted = useRef(false)
  const searchedCoord = useAppSelector(searchedCoordSelect)

  const { setMapApi, mapApi, setOverlay } = useKakaoMap()

  useEffect(() => {
    if (!isMapMounted.current) {
      kakao.maps.load(() => {
        const container = document.getElementById('map') as HTMLDivElement
        const mapOption = {
          center: searchedCoord
            ? new kakao.maps.LatLng(searchedCoord.lat, searchedCoord.lng)
            : new kakao.maps.LatLng(
                DEFAULT_KAKAO_COORD.lat,
                DEFAULT_KAKAO_COORD.lng
              ), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        }
        const map = new kakao.maps.Map(container, mapOption)
        setMapApi(map)
        setOverlay()
      })
    }
    return () => {
      isMapMounted.current = true
    }
  }, [setMapApi, searchedCoord, setOverlay])

  // 화면 사이즈 조정시 가운데 재 조정을 위한 함수
  const resizeMap = useCallback(() => {
    if (mapApi && searchedCoord)
      mapApi.setCenter(
        new kakao.maps.LatLng(searchedCoord.lat, searchedCoord.lng)
      )
  }, [mapApi, searchedCoord])

  useEffect(() => {
    window.addEventListener('resize', resizeMap)
    return () => {
      window.removeEventListener('resize', resizeMap)
    }
  }, [resizeMap])

  return (
    <MapViewer id="map">
      <Tooltip />
    </MapViewer>
  )
}

export default Map
