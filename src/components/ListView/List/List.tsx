import React, { useEffect, useRef } from 'react'
import KeywordBadge from '@components/styles/KeywordBadge'
import { useKakaoMap } from '@context/MapContext'
import { setClickedStore } from '@stores/conv/convSlice'
import { useAppDispatch } from '@stores/store'
import { StarFilled } from '@ant-design/icons'
import { ConBox, Title, Content } from './List.styles'

interface ListProps {
  placeName: string
  lat: number
  lng: number
  storeId: string
  starCount: number
  keywords: string[]
  reviewCount: number
  targetStoreId: string
  setTargetStoreId: (targetStoreId: string) => void
}

const List: React.FC<ListProps> = ({
  placeName,
  lat,
  lng,
  storeId,
  starCount,
  reviewCount,
  keywords,
  targetStoreId,
  setTargetStoreId,
}) => {
  const dispatch = useAppDispatch()
  const listRef = useRef<HTMLLIElement>(null)

  const { mapApi, kakaoService, storeOverlay } = useKakaoMap()

  const listClickHandler = () => {
    if (mapApi && kakaoService && storeOverlay) {
      const center = new kakaoService.maps.LatLng(lat, lng)
      storeOverlay.setPosition(center)
      storeOverlay.setContent('<div id="kakao-overlay"></div>')
      storeOverlay.setMap(mapApi)
      mapApi.panTo(center)

      dispatch(setClickedStore(storeId))
      setTargetStoreId(storeId)

      listRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  useEffect(() => {
    if (!listRef.current) return
    if (storeId === targetStoreId) {
      listRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [storeId, targetStoreId])

  return (
    <ConBox
      ref={listRef}
      onClick={listClickHandler}
      className={targetStoreId === storeId ? 'active' : ''}
    >
      <Title>
        <h2>{placeName}</h2>
        <div className="star_box">
          <StarFilled />
          <span>{starCount}</span>
        </div>
      </Title>

      <Content>
        <ul>
          {keywords.slice(0, 3).map((keyword) => (
            <KeywordBadge key={keyword}>{keyword}</KeywordBadge>
          ))}
        </ul>

        <span className="review">리뷰 {reviewCount}개</span>
      </Content>
    </ConBox>
  )
}

export default List
