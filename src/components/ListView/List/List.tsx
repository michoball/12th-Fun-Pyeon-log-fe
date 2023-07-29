import React, { useEffect, useRef } from 'react'
import KeywordBadge from '@components/styles/KeywordBadge'
import { clickedStoreSelect, setClickedStore } from '@stores/conv/convSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import { useKakaoMap } from 'hooks/MapContext'
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
  setTargetStoreId: React.Dispatch<React.SetStateAction<string>>
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
  const clickedStore = useAppSelector(clickedStoreSelect)

  const { mapApi, storeOverlay } = useKakaoMap()

  const listClickHandler = () => {
    if (clickedStore && clickedStore.id === storeId) return

    if (mapApi && storeOverlay) {
      const center = new kakao.maps.LatLng(lat, lng)
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
