import React from 'react'
import { useParams } from 'react-router-dom'
import StoreBasicInfo from '@components/StoreDisplay/StoreBasicInfo/StoreBasicInfo'
import LoadingWithLogo from '@components/styles/LoadingWithLogo'
import WritingBox from '@components/Writing/WritingBox/WritingBox'
import { selectedConvSelect } from '@stores/conv/convSlice'
import { reviewLoadingSelect } from '@stores/review/reivewSlice'
import { useAppSelector } from '@stores/store'

import { StoreWrapper } from '@pages/Store/Store.styles'

const Write = () => {
  const { storeId } = useParams()
  const selectedStore = useAppSelector(selectedConvSelect)
  const loading = useAppSelector(reviewLoadingSelect)

  return (
    <StoreWrapper>
      {loading && <LoadingWithLogo />}
      {selectedStore && (
        <StoreBasicInfo
          placeName={selectedStore.place_name}
          addressName={selectedStore.address_name}
          phone={selectedStore.phone}
          keywordList={selectedStore.keywordList}
          starCount={selectedStore.starCount}
        />
      )}
      {storeId && <WritingBox storeId={storeId} />}
    </StoreWrapper>
  )
}

export default Write
