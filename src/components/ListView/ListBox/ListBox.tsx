import React, { useState, useEffect } from 'react'
import List from '@components/ListView/List/List'
import LoadingWithLogo from '@components/styles/LoadingWithLogo'
import { useKakaoMap } from '@context/MapContext'
import {
  convSortTypeSelect,
  convloadingSelect,
  setClickedStore,
  setSortType,
  sortedStoreSelect,
  storeFilterAction,
} from '@stores/conv/convSlice'
import { ConvType } from '@stores/conv/convType'
import { brandSelect, keywordSelect } from '@stores/sort/sortSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import { LIST_SORT_ITEMS } from '@utils/constants'
import { ListWrapper, SortBtns, ResultBox } from './ListBox.styles'

const ListBox = () => {
  const dispatch = useAppDispatch()
  const sortedConv = useAppSelector(sortedStoreSelect)
  const loading = useAppSelector(convloadingSelect)
  const sortType = useAppSelector(convSortTypeSelect)
  const brandData = useAppSelector(brandSelect)
  const keywordData = useAppSelector(keywordSelect)

  const { selectedMarker, markerResetting } = useKakaoMap()

  const [targetStoreId, setTargetStoreId] = useState('')
  const [stores, setStores] = useState<ConvType[]>([])

  useEffect(() => {
    if (selectedMarker.length > 0) {
      setTargetStoreId(selectedMarker)
      dispatch(setClickedStore(selectedMarker))
    }
  }, [selectedMarker, dispatch])

  useEffect(() => {
    const filteredStore = storeFilterAction(brandData, keywordData, sortedConv)
    setStores(filteredStore)
    markerResetting(filteredStore)
  }, [sortedConv, markerResetting, brandData, keywordData])

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
        ) : stores.length === 0 ? (
          <p className="noResult">검색 결과가 없습니다.</p>
        ) : (
          stores.map((store) => (
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
