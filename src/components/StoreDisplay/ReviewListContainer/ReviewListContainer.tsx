import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import ReviewList from '@components/StoreDisplay/ReviewList/ReviewList'
import FunButton, { BUTTON_TYPE_CLASSES } from '@components/styles/FunButton'
import Spinner from '@components/styles/Spinner'
import { userSelect } from '@stores/auth/authSlice'
import {
  fetchAllReviews,
  reviewLoadingSelect,
  reviewsSelect,
} from '@stores/review/reivewSlice'
import { useAppDispatch, useAppSelector } from '@stores/store'
import URLUtill from '@utils/urlUtill'
import { PlusOutlined } from '@ant-design/icons'
import {
  ReviewListWrapper,
  ReviewTop,
  NameNCount,
  ListContainer,
} from './ReviewListContainer.styles'

interface ReviewListProps {
  totalReviewCount: number
}

const ReviewListContainer: React.FC<ReviewListProps> = ({
  totalReviewCount,
}) => {
  const { storeId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const reviews = useAppSelector(reviewsSelect)
  const user = useAppSelector(userSelect)
  const loading = useAppSelector(reviewLoadingSelect)

  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const observer = useRef<IntersectionObserver | null>(null)

  const lastReviewRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevNum) => prevNum + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [hasMore, loading]
  )

  const moveToWrite = () => {
    if (!user) {
      alert('로그인 후 이용 가능합니다.')
      return
    }
    if (storeId) {
      navigate(URLUtill.getReviewWriteUrl(storeId))
    }
  }

  useEffect(() => {
    setHasMore(totalReviewCount > reviews.length)
  }, [reviews, totalReviewCount])

  useEffect(() => {
    if (storeId && hasMore) {
      dispatch(fetchAllReviews({ storeId, page }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, storeId, dispatch])

  return (
    <ReviewListWrapper>
      <ReviewTop>
        <NameNCount>
          <h1>REVIEW</h1>
          <div className="count">
            <PlusOutlined />
            <p>{totalReviewCount}</p>
          </div>
        </NameNCount>
        <div className="button">
          <FunButton
            buttonType={BUTTON_TYPE_CLASSES.base}
            className={user ? '' : 'disabled'}
            onClick={moveToWrite}
          >
            작성하기
          </FunButton>
        </div>
      </ReviewTop>

      <ListContainer>
        {reviews.map((review, idx) => {
          if (reviews.length === idx + 1) {
            return (
              <ReviewList
                ref={lastReviewRef}
                key={review.reviewEntryNo}
                reviewId={review.reviewEntryNo}
                starCount={review.starCount}
                createdDate={review.createdDate}
                keywords={review.keywords}
                reviewContent={review.reviewContent}
                userId={review.userEmail}
              />
            )
          } else {
            return (
              <ReviewList
                key={review.reviewEntryNo}
                reviewId={review.reviewEntryNo}
                starCount={review.starCount}
                createdDate={review.createdDate}
                keywords={review.keywords}
                reviewContent={review.reviewContent}
                userId={review.userEmail}
              />
            )
          }
        })}
        {totalReviewCount === 0 && (
          <p className="noReview">등록된 리뷰가 없습니다.</p>
        )}
        {loading && (
          <div style={{ margin: '10px 0 ' }}>
            <Spinner />
          </div>
        )}
      </ListContainer>
    </ReviewListWrapper>
  )
}

export default ReviewListContainer
