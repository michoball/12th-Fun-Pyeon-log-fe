import React, { useState, useEffect, useContext, useRef } from 'react'
import List from '@components/ListView/List/List'
import LoadingWithLogo from '@components/styles/LoadingWithLogo'
import { MapContext } from '@context/MapContext'
import {
  convSortTypeSelect,
  convloadingSelect,
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

  const { mapApi, setMarkers, selectedMarker, kakaoService } =
    useContext(MapContext)

  const [targetStoreId, setTargetStoreId] = useState('')
  const listRef = useRef<HTMLLIElement[] | null[]>([])

  const toggleBtn = (type: 'star' | 'review' | 'distance') => {
    dispatch(setSortType(type))
  }

  useEffect(() => {
    if (selectedMarker) setTargetStoreId(selectedMarker.getTitle())
  }, [selectedMarker])

  useEffect(() => {
    listRef.current[Number(targetStoreId)]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [targetStoreId])

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
            onClick={() => toggleBtn(sort.type)}
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
            <li
              key={store.id}
              ref={(el) => (listRef.current[Number(store.id)] = el)}
            >
              <List
                starCount={store.starCount}
                keywords={store.keywordList}
                reviewCount={store.reviewCount}
                placeName={store.place_name}
                lat={Number(store.y)}
                lng={Number(store.x)}
                storeId={store.id}
                address={store.address_name}
                phoneNumber={store.phone}
                targetStoreId={targetStoreId}
                setTargetStoreId={setTargetStoreId}
              />
            </li>
          ))
        )}
      </ResultBox>
    </ListWrapper>
  )
}

export default ListBox
