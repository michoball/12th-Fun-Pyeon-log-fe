import React, { useState, useEffect, useMemo } from 'react'
import List from '@components/ListView/List/List'
import LoadingWithLogo from '@components/styles/LoadingWithLogo'
import { convloadingSelect, setClickedStore } from '@stores/conv/convSlice'
import { ConvType } from '@stores/conv/convType'
import {
  saveSortType,
  sortTypeSelect,
  storeSortAction,
} from '@stores/sort/sortSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import { LIST_SORT_ITEMS } from '@utils/constants'
import { useKakaoMap } from 'hooks/MapContext'
import { ListWrapper, SortBtns, ResultBox } from './ListBox.styles'

interface ListBoxProps {
  stores: ConvType[]
}

const ListBox: React.FC<ListBoxProps> = ({ stores }) => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(convloadingSelect)
  const sortType = useAppSelector(sortTypeSelect)
  const sortedStores = useMemo(
    () => storeSortAction(sortType, stores),
    [sortType, stores]
  )

  const { selectedMarkerId } = useKakaoMap()
  const [targetStoreId, setTargetStoreId] = useState('')

  useEffect(() => {
    if (selectedMarkerId.length) {
      setTargetStoreId(selectedMarkerId)
      dispatch(setClickedStore(selectedMarkerId))
    }
  }, [selectedMarkerId, dispatch])

  return (
    <ListWrapper>
      <SortBtns>
        {LIST_SORT_ITEMS.map((sort) => (
          <li
            key={sort.type}
            className={sortType === sort.type ? 'active' : ''}
            onClick={() => dispatch(saveSortType(sort.type))}
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
          sortedStores.map((store) => (
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
