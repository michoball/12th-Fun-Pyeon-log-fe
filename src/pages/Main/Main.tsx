import React, { useEffect, useRef, useState } from 'react'
import FilterBox from '@components/FilterBox/FilterBox'
import ListBox from '@components/ListView/ListBox/ListBox'
import Map from '@components/Map/Map'
import MapController from '@components/MapController/MapController'
import { useKakaoMap } from '@context/MapContext'
import { setUserPosition, userPositionSelect } from '@stores/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import { DEFAULT_KAKAO_COORD } from '@utils/constants'
import useSearchStore, { SearchType } from 'hooks/useSearchStore'

import styled from 'styled-components'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import {
  Wrapper,
  ListView,
  ListTop,
  SearchBox,
  SortBtn,
  MapWrap,
} from './Main.styles'

styled(MapController)`
  width: 70vw;
  border: 1px solid #222;
`

const Main = () => {
  const dispatch = useAppDispatch()
  const { mapApi, kakaoService } = useKakaoMap()
  const [isFiltering, setIsFiltering] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const userPosition = useAppSelector(userPositionSelect)
  const { searchStore } = useSearchStore()

  const updateValue = (e: React.FormEvent) => {
    e.preventDefault()
    const { current } = inputRef
    if (!current || !mapApi || !kakaoService) return
    if (current.value.trim()) {
      searchStore(SearchType.KEYWORD, mapApi, kakaoService, current.value)
    } else {
      alert('검색어를 입력해주세요.')
      current.value = ''
    }
  }

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

  return (
    <Wrapper>
      <ListView>
        <ListTop>
          <SearchBox onSubmit={updateValue}>
            <input
              type="text"
              ref={inputRef}
              placeholder="편의점을 검색하세요."
            />
            <button type="submit">
              <SearchOutlined />
            </button>
          </SearchBox>

          <SortBtn
            className={isFiltering ? 'on' : ''}
            onClick={() => setIsFiltering(!isFiltering)}
          >
            <FilterOutlined />
          </SortBtn>
        </ListTop>

        {isFiltering ? (
          <FilterBox setIsFiltering={setIsFiltering} />
        ) : (
          <ListBox />
        )}
      </ListView>
      <MapWrap>
        <Map />
        {mapApi && userPosition && kakaoService && (
          <MapController
            mapApi={mapApi}
            userPosition={userPosition}
            kakaoService={kakaoService}
          />
        )}
      </MapWrap>
    </Wrapper>
  )
}

export default Main
