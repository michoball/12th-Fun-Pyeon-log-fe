import React, { useState, useEffect } from 'react'
import List from '@components/ListView/List/List'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@stores/store'
import { ListWrapper, SortBtns, ResultBox } from './ListBox.styles'
import { ConvType } from '@stores/conv/convType'
import { LIST_SORT_ITEMS } from '@utils/constants'
import { distanceSort, reviewSort, starSort } from '@stores/conv/convSlice'
import { saveSortType } from '@stores/sort/sortSlice'
import LoadingWithLogo from '@styles/LoadingWithLogo'

const ListBox = () => {
  const sortedConv = useSelector((state: RootState) => state.conv.sortedStores)
  const loading = useSelector((state: RootState) => state.conv.loading)
  const sortType = useSelector((state: RootState) => state.sort.sortType)
  const [convList, setConvList] = useState<ConvType[]>([])
  const dispatch = useDispatch()
  const [select, setSelect] = useState(LIST_SORT_ITEMS[0].type)

  const toggleBtn = (type: string) => {
    setSelect(type)
    dispatch(saveSortType(type))
    if (type === 'star') dispatch(starSort())
    if (type === 'review') dispatch(reviewSort())
    if (type === 'distance') dispatch(distanceSort())
  }

  useEffect(() => {
    setConvList(sortedConv)

    if (convList.length !== 0) {
      toggleBtn(sortType)
    }
  }, [sortedConv])

  return (
    <ListWrapper>
      <SortBtns>
        {LIST_SORT_ITEMS.map((sort) => (
          <li
            key={sort.type}
            className={select === sort.type ? 'active' : ''}
            onClick={() => toggleBtn(sort.type)}
          >
            {sort.title}
          </li>
        ))}
      </SortBtns>

      <ResultBox>
        {loading ? (
          <LoadingWithLogo />
        ) : convList.length === 0 ? (
          <p className="noResult">검색 결과가 없습니다.</p>
        ) : (
          convList.map((store) => (
            <List
              key={store.id}
              starCount={store.starCount}
              keywords={store.keywordList}
              reviewCount={store.reviewCount}
              placeName={store.place_name}
              lat={+store.y}
              lng={+store.x}
              storeId={store.id}
            />
          ))
        )}
      </ResultBox>
    </ListWrapper>
  )
}

export default ListBox
