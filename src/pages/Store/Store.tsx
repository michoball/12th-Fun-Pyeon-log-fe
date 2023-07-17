import React, { useContext, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Map from '@components/Map/Map'
import ReviewListContainer from '@components/StoreDisplay/ReviewListContainer/ReviewListContainer'
import StoreBasicInfo from '@components/StoreDisplay/StoreBasicInfo/StoreBasicInfo'
import LoadingWithLogo from '@components/styles/LoadingWithLogo'
import { MapContext } from '@context/MapContext'
import {
  convloadingSelect,
  fetchStoreInfo,
  selectedConvSelect,
} from '@stores/conv/convSlice'
import { initReviews } from '@stores/review/reivewSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import { StoreWrapper, StoreMapWrapper } from './Store.styles'

const Store = () => {
  const dispatch = useAppDispatch()
  const [storeParam] = useSearchParams()
  const { mapApi, deleteMarkers, displayMyLocation, kakaoService } =
    useContext(MapContext)

  const storeMarkerRef = useRef<kakao.maps.Marker>()

  const { storeId } = useParams()
  const selectedStore = useAppSelector(selectedConvSelect)
  const loading = useAppSelector(convloadingSelect)

  useEffect(() => {
    const encodedAddress = storeParam.get('address')
    if (storeId && encodedAddress && kakaoService) {
      const kakaoSearch = new kakaoService.maps.services.Places()
      const decodedAddress = decodeURIComponent(encodedAddress)
      kakaoSearch.keywordSearch(`${decodedAddress} 편의점`, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const searchedStore = data.filter((store) => store.id === storeId)
          dispatch(fetchStoreInfo({ storeId, searchedStore }))
          dispatch(initReviews())
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, dispatch, storeParam])

  useEffect(() => {
    if (!mapApi || !kakaoService) return

    deleteMarkers()

    if (storeMarkerRef.current) {
      storeMarkerRef.current.setMap(null)
    }

    if (selectedStore) {
      const [storeBrand] = selectedStore.place_name
        ? selectedStore.place_name.split(' ', 1)
        : ['펀편log']

      const center = new kakaoService.maps.LatLng(
        Number(selectedStore.y),
        Number(selectedStore.x)
      ) // 지도의 중심좌표 재설정
      mapApi.setCenter(center)
      mapApi.setLevel(3)
      // 편의점 위치에 마커 생성
      storeMarkerRef.current = displayMyLocation(kakaoService, storeBrand)
      storeMarkerRef.current?.setMap(mapApi)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore, deleteMarkers, mapApi, displayMyLocation])

  return (
    <StoreWrapper>
      {loading && <LoadingWithLogo />}
      {selectedStore && (
        <>
          <StoreBasicInfo
            placeName={selectedStore.place_name}
            addressName={selectedStore.address_name}
            phone={selectedStore.phone}
            keywordList={selectedStore.keywordList}
            starCount={selectedStore.starCount}
          />
          <ReviewListContainer totalReviewCount={selectedStore.reviewCount} />
        </>
      )}
      <StoreMapWrapper>
        <Map />
      </StoreMapWrapper>
    </StoreWrapper>
  )
}

export default Store
