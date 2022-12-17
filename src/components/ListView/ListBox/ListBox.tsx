import React from 'react'
import List from '@components/ListView/List/List'
import { useSelector } from 'react-redux'
import type { RootState } from '@stores/store'
import { ListWrapper, SortBtns, ResultBox } from './ListBox.styles'

const ListBox = () => {
  const stores = useSelector((state: RootState) => state.conv.stores)
  return (
    <ListWrapper>
      <SortBtns>
        <li className="active">가까운순</li>
        <li>별점 높은순</li>
        <li>리뷰 많은순</li>
      </SortBtns>

      <ResultBox>
        {stores.length === 0 ? (
          <p className="noResult">검색 결과가 없습니다.</p>
        ) : (
          stores.map((store) => (
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
