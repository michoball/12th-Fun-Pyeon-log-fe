import React, { useState } from 'react'
import Select from '@components/common/Select/Select'
import FunButton from '@components/styles/FunButton'
import { useKakaoMap } from '@context/MapContext'
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
  const brandData = useAppSelector(brandSelect)
  const keywordData = useAppSelector(keywordSelect)

  const { storeOverlay } = useKakaoMap()

  const [selectBrand, setSelectBrand] = useState(brandData)
  const [selectKeyword, setSelectKeyword] = useState(keywordData)

  const sortStoreHandler = () => {
    dispatch(saveBrand(selectBrand))
    dispatch(saveKeyword(selectKeyword))
    setIsFiltering(false)
    storeOverlay?.setMap(null)
  }

  const sortInitHandler = () => {
    dispatch(resetSort())
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
