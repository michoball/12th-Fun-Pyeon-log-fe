import React, { useState } from 'react'
import Select from '@components/common/Select/Select'
import FunButton from '@components/styles/FunButton'
import { useKakaoMap } from '@context/MapContext'
import { convSelect, setSortStores } from '@stores/conv/convSlice'
import { ConvType } from '@stores/conv/convType'
import {
  brandSelect,
  keywordSelect,
  resetSort,
  saveBrand,
  saveKeyword,
} from '@stores/sort/sortSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import { BRANDS, ITEMS } from '@utils/constants'
import { FilterWrapper, KeywordGroup, Title } from './FilterBox.styles'

interface filterProps {
  setIsFiltering: (isFiltering: boolean) => void
}

const Filter: React.FC<filterProps> = ({ setIsFiltering }) => {
  const dispatch = useAppDispatch()
  const stores = useAppSelector(convSelect)
  const brandData = useAppSelector(brandSelect)
  const keywordData = useAppSelector(keywordSelect)

  const { setMarkers, deleteMarkers, mapApi, storeOverlay } = useKakaoMap()

  const [selectBrand, setSelectBrand] = useState(brandData)
  const [selectKeyword, setSelectKeyword] = useState(keywordData)

  const onStoresFilter = () => {
    let filteredStore: ConvType[]

    if (selectBrand.length === 0) {
      filteredStore = [...stores]
    } else if (selectBrand.includes('기타')) {
      const newData = stores.filter((data) =>
        selectBrand.includes(data.place_name.split(' ')[0])
      )
      const etcData = stores.filter(
        (data) =>
          !BRANDS.filter((brand) => brand !== '기타').includes(
            data.place_name.split(' ')[0]
          )
      )
      filteredStore = [...newData, ...etcData]
    } else {
      filteredStore = stores.filter((data) =>
        selectBrand.includes(data.place_name.split(' ')[0])
      )
    }

    return selectKeyword.length
      ? filteredStore.filter((data) =>
          data.keywordList.some((keyword) => selectKeyword.includes(keyword))
        )
      : filteredStore
  }

  // 필터링 된 편의점에 마커를 씌우는 함수
  const sortCallBack = (data: ConvType[]) => {
    if (mapApi) {
      deleteMarkers()
      for (let i = 0; i < data.length; i++) {
        setMarkers(data[i], mapApi)
      }
    }
  }

  const sortStoreHandler = () => {
    const sortResult = onStoresFilter()
    dispatch(setSortStores(sortResult))
    sortCallBack(sortResult)
    dispatch(saveBrand(selectBrand))
    dispatch(saveKeyword(selectKeyword))
    setIsFiltering(false)
    storeOverlay?.setMap(null)
  }

  const sortInitHandler = () => {
    dispatch(setSortStores(stores))
    dispatch(resetSort())
    sortCallBack(stores)
    setIsFiltering(false)
  }

  return (
    <FilterWrapper>
      <FunButton onClick={sortInitHandler} className="initBtn opposite">
        초기화
      </FunButton>

      <div>
        <Title>브랜드</Title>
        <Select
          keywordArray={BRANDS}
          selected={selectBrand}
          setSelected={setSelectBrand}
          selectType={'brand'}
        />
      </div>

      <KeywordGroup>
        <Title>키워드</Title>

        <>
          {ITEMS.map((el) => (
            <Select
              key={el.title}
              title={el.title}
              keywordArray={el.keywordArray}
              selected={selectKeyword}
              setSelected={setSelectKeyword}
              selectType={'checkbox'}
            />
          ))}
        </>
      </KeywordGroup>

      <FunButton
        style={{ width: '100%', minHeight: '30px', fontWeight: '700' }}
        onClick={sortStoreHandler}
      >
        찾아보기
      </FunButton>
    </FilterWrapper>
  )
}

export default Filter
