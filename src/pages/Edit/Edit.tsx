import React from 'react'
import { useParams } from 'react-router-dom'
import StoreBasicInfo from '@components/StoreDisplay/StoreBasicInfo/StoreBasicInfo'
import WritingBox from '@components/Writing/WritingBox/WritingBox'
import { selectedConvSelect } from '@stores/conv/convSlice'
import { selectedReviewSelect } from '@stores/review/reivewSlice'
import { useAppSelector } from '@stores/store'
import { StoreWrapper } from '@pages/Store/Store.styles'

const Edit = () => {
  const { storeId } = useParams()
  const selectedStore = useAppSelector(selectedConvSelect)
  const selectedReview = useAppSelector(selectedReviewSelect)

  return (
    <StoreWrapper>
      {selectedStore && (
        <StoreBasicInfo
          placeName={selectedStore.place_name}
          addressName={selectedStore.address_name}
          phone={selectedStore.phone}
          keywordList={selectedStore.keywordList}
          starCount={selectedStore.starCount}
        />
      )}
      {selectedReview && storeId && (
        <WritingBox storeId={storeId} originReview={selectedReview} />
      )}
    </StoreWrapper>
  )
}

export default Edit
