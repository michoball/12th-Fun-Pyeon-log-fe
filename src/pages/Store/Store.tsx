import React, { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Map from '@components/Map/Map'
import ReviewListContainer from '@components/StoreDisplay/ReviewListContainer/ReviewListContainer'
import StoreBasicInfo from '@components/StoreDisplay/StoreBasicInfo/StoreBasicInfo'
import LoadingWithLogo from '@components/styles/LoadingWithLogo'
import {
  clickedStoreSelect,
  convloadingSelect,
  fetchStoreInfo,
} from '@stores/conv/convSlice'
import { initReviews } from '@stores/review/reivewSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import { useKakaoMap } from 'hooks/MapContext'
import { StoreWrapper, StoreMapWrapper } from './Store.styles'

const Store = () => {
  const dispatch = useAppDispatch()
  const { storeId } = useParams()
  const [storeParam] = useSearchParams()
  const { mapApi, deleteMarkers, setMyMarker } = useKakaoMap()

  const selectedStore = useAppSelector(clickedStoreSelect)
  const loading = useAppSelector(convloadingSelect)

  useEffect(() => {
    const encodedAddress = storeParam.get('address')
    if (storeId && encodedAddress && mapApi) {
      const kakaoSearch = new kakao.maps.services.Places(mapApi)
      const decodedAddress = decodeURIComponent(encodedAddress)
      kakaoSearch.keywordSearch(`${decodedAddress} 편의점`, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const searchedStore = data.filter((store) => store.id === storeId)
          dispatch(fetchStoreInfo({ storeId, searchedStore }))
        }
      })
      dispatch(initReviews())
    }
  }, [storeId, dispatch, storeParam, mapApi])

  useEffect(() => {
    if (!mapApi || !selectedStore) return

    deleteMarkers()
    const [storeBrand] = selectedStore.place_name.split(' ', 1) ?? ['펀편log']
    const center = new kakao.maps.LatLng(
      Number(selectedStore.y),
      Number(selectedStore.x)
    )
    // 지도의 중심좌표 재설정
    mapApi.setCenter(center)
    mapApi.setLevel(3)
    setMyMarker(storeBrand)
  }, [selectedStore, deleteMarkers, mapApi, setMyMarker])

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
