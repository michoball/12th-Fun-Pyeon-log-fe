import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from '@components/common/Select/Select'
import FunButton from '@components/styles/FunButton'
import StarBox from '@components/Writing/StarBox/StarBox'
import TextBox from '@components/Writing/TextBox/TextBox'
import { createReview, updateReview } from '@stores/review/reivewSlice'
import { ReviewType, WriteType } from '@stores/review/reviewType'
import { useAppDispatch } from '@stores/store'
import { ITEMS } from '@utils/constants'

import {
  BtnBox,
  KeyBox,
  Keywords,
  WritingBoxWrapper,
} from './WritingBox.styles'

interface EditProps {
  storeId: string
  originReview?: ReviewType
}

const WritingBox: React.FC<EditProps> = ({ storeId, originReview }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [starCount, setStarCount] = useState(originReview?.starCount ?? 0)
  const [selected, setSelected] = useState<string[]>(
    originReview?.keywords ?? []
  )
  const [reviewContent, setReviewContent] = useState(
    originReview?.reviewContent ?? ''
  )

  const submitReview = () => {
    if (!reviewContent.length) {
      return alert('리뷰를 작성해주세요')
    }

    const reviewData: WriteType = {
      reviewContent,
      starCount,
      keywords: selected,
    }

    if (originReview) {
      dispatch(
        updateReview({
          reviewData,
          storeId,
          reviewId: originReview.reviewEntryNo,
        })
      )
    } else {
      dispatch(createReview({ reviewData, storeId }))
    }

    navigate(-1)
  }

  return (
    <WritingBoxWrapper>
      <KeyBox>
        <StarBox starCount={starCount} setStarCount={setStarCount} />

        <Keywords>
          {ITEMS.map((el) => (
            <Select
              key={el.title}
              title={el.title}
              keywordArray={el.keywordArray}
              selected={selected}
              setSelected={setSelected}
              selectType={'keyword'}
            />
          ))}
        </Keywords>
      </KeyBox>

      <TextBox
        reviewContent={reviewContent}
        setReviewContent={setReviewContent}
      />

      <BtnBox>
        <FunButton className="opposite" onClick={() => navigate(-1)}>
          취소
        </FunButton>

        <FunButton onClick={submitReview}>
          {originReview ? '수정하기' : '게시하기'}
        </FunButton>
      </BtnBox>
    </WritingBoxWrapper>
  )
}

export default WritingBox
