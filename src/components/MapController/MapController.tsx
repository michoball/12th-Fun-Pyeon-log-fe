import React, { useEffect } from 'react'
import FunButton, { BUTTON_TYPE_CLASSES } from '@components/styles/FunButton'
import { fetchAllStores } from '@stores/conv/convSlice'
import { searchedCoordSelect, setSearchedCoord } from '@stores/sort/sortSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import { kakaoCategorySearch } from '@utils/kakao'
import { AimOutlined } from '@ant-design/icons'
import { ControlBtns } from './MapController.styles'

interface MapControllerProps {
  mapApi: kakao.maps.Map
  userPosition: {
    lat: number
    lng: number
  }
}

const MapController: React.FC<MapControllerProps> = ({
  mapApi,
  userPosition,
}) => {
  const searchedCoord = useAppSelector(searchedCoordSelect)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (searchedCoord) {
      const center = new kakao.maps.LatLng(searchedCoord.lat, searchedCoord.lng)
      mapApi.setCenter(center)
    }
    kakaoCategorySearch(mapApi, (mapData, lat, lng) => {
      dispatch(setSearchedCoord({ lat, lng }))
      dispatch(fetchAllStores({ mapData }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //  지도를 사용자의 위치로 이동하는 함수
  const moveToUserLocation = () => {
    // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
    const locPosition = new kakao.maps.LatLng(
      userPosition.lat,
      userPosition.lng
    )
    mapApi.setCenter(locPosition)
    kakaoCategorySearch(mapApi, (mapData, lat, lng) => {
      dispatch(setSearchedCoord({ lat, lng }))
      dispatch(fetchAllStores({ mapData }))
    })
  }

  const searchFromHereHandler = () => {
    kakaoCategorySearch(mapApi, (mapData, lat, lng) => {
      dispatch(setSearchedCoord({ lat, lng }))
      dispatch(fetchAllStores({ mapData }))
    })
  }

  return (
    <ControlBtns>
      <FunButton
        buttonType={BUTTON_TYPE_CLASSES.map}
        onClick={searchFromHereHandler}
      >
        이 위치에서 다시 검색
      </FunButton>
      <FunButton
        buttonType={BUTTON_TYPE_CLASSES.map}
        onClick={moveToUserLocation}
        className="web"
      >
        내 위치로 이동
      </FunButton>
      <FunButton
        buttonType={BUTTON_TYPE_CLASSES.map}
        onClick={moveToUserLocation}
        className="tablet"
      >
        <AimOutlined />
      </FunButton>
    </ControlBtns>
  )
}

export default MapController
