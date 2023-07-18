import React, { useState, useEffect } from 'react'
import List from '@components/ListView/List/List'
import LoadingWithLogo from '@components/styles/LoadingWithLogo'
import { useKakaoMap } from '@context/MapContext'
import {
  convSortTypeSelect,
  convloadingSelect,
  setClickedStore,
  setSortType,
  sortedConvSelect,
} from '@stores/conv/convSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import { LIST_SORT_ITEMS } from '@utils/constants'
import { ListWrapper, SortBtns, ResultBox } from './ListBox.styles'

const ListBox = () => {
  const dispatch = useAppDispatch()
  const sortedConv = useAppSelector(sortedConvSelect)
  const loading = useAppSelector(convloadingSelect)
  const sortType = useAppSelector(convSortTypeSelect)

  const { mapApi, setMarkers, selectedMarker, kakaoService } = useKakaoMap()

  const [targetStoreId, setTargetStoreId] = useState('')

  useEffect(() => {
    if (selectedMarker.length) {
      setTargetStoreId(selectedMarker)
      dispatch(setClickedStore(selectedMarker))
    }
  }, [selectedMarker, dispatch])

  useEffect(() => {
    if (!mapApi || !kakaoService) return
    sortedConv.forEach((list) => {
      setMarkers(list, mapApi)
    })
  }, [mapApi, sortedConv, setMarkers, kakaoService])

  return (
    <ListWrapper>
      <SortBtns>
        {LIST_SORT_ITEMS.map((sort) => (
          <li
            key={sort.type}
            className={sortType === sort.type ? 'active' : ''}
            onClick={() => dispatch(setSortType(sort.type))}
          >
            {sort.title}
          </li>
        ))}
      </SortBtns>

      <ResultBox>
        {loading ? (
          <LoadingWithLogo />
        ) : sortedConv.length === 0 ? (
          <p className="noResult">검색 결과가 없습니다.</p>
        ) : (
          sortedConv.map((store) => (
            <List
              key={store.id}
              starCount={store.starCount}
              keywords={store.keywordList}
              reviewCount={store.reviewCount}
              placeName={store.place_name}
              lat={Number(store.y)}
              lng={Number(store.x)}
              storeId={store.id}
              targetStoreId={targetStoreId}
              setTargetStoreId={setTargetStoreId}
            />
          ))
        )}
      </ResultBox>
    </ListWrapper>
  )
}

export default ListBox
