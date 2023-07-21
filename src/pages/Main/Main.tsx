import React, { useEffect, useRef, useState } from 'react'
import FilterBox from '@components/FilterBox/FilterBox'
import ListBox from '@components/ListView/ListBox/ListBox'
import Map from '@components/Map/Map'
import MapController from '@components/MapController/MapController'
import { userPositionSelect } from '@stores/auth/authSlice'
import {
  fetchAllStores,
  sortedStoreSelect,
  storeFilterAction,
} from '@stores/conv/convSlice'
import { ConvType } from '@stores/conv/convType'
import {
  brandSelect,
  keywordSelect,
  setSearchedCoord,
} from '@stores/sort/sortSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import { kakaoKeywordSearch } from '@utils/kakao'
import { useKakaoMap } from 'hooks/MapContext'
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
  const brandData = useAppSelector(brandSelect)
  const keywordData = useAppSelector(keywordSelect)
  const sortedConv = useAppSelector(sortedStoreSelect)
  const userPosition = useAppSelector(userPositionSelect)

  const { mapApi, markerResetting } = useKakaoMap()

  const [isFiltering, setIsFiltering] = useState(false)
  const [stores, setStores] = useState<ConvType[]>([])

  const inputRef = useRef<HTMLInputElement>(null)

  const updateValue = (e: React.FormEvent) => {
    e.preventDefault()
    const { current } = inputRef
    if (!current || !mapApi) return
    if (current.value.trim()) {
      kakaoKeywordSearch(mapApi, current.value, (mapData, lat, lng) => {
        dispatch(setSearchedCoord({ lat, lng }))
        dispatch(fetchAllStores({ mapData, lat, lng }))
      })
    } else {
      alert('검색어를 입력해주세요.')
      current.value = ''
    }
  }
  useEffect(() => {
    const filteredStore = storeFilterAction(brandData, keywordData, sortedConv)
    setStores(filteredStore)
    markerResetting(filteredStore)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedConv, markerResetting, brandData])

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
          <ListBox stores={stores} />
        )}
      </ListView>
      <MapWrap>
        <Map />
        {mapApi && userPosition && (
          <MapController mapApi={mapApi} userPosition={userPosition} />
        )}
      </MapWrap>
    </Wrapper>
  )
}

export default Main
