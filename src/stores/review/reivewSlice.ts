import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit'
import ErrorService from '@services/errorService'
import ReviewService from '@services/reviewService'
import { RootState } from '@stores/store'
import { ReviewState, ReviewType, WriteType } from './reviewType'

const initialState: ReviewState = {
  reviews: [],
  selectedReview: null,
  loading: false,
  error: '',
}

export const fetchAllReviews = createAsyncThunk(
  'review/fetchAll',
  async (data: { storeId: string; page: number }, thunkApi) => {
    const { storeId, page } = data
    try {
      return await ReviewService.getAllReviews(storeId, page)
    } catch (error) {
      const message = ErrorService.axiosErrorHandler(error)
      return thunkApi.rejectWithValue(message)
    }
  }
)

export const createReview = createAsyncThunk(
  'review/create',
  async (review: { reviewData: WriteType; storeId: string }, thunkApi) => {
    const { reviewData, storeId } = review
    try {
      return await ReviewService.createReview(reviewData, storeId)
    } catch (error) {
      const message = ErrorService.axiosErrorHandler(error)
      return thunkApi.rejectWithValue(message)
    }
  }
)

export const updateReview = createAsyncThunk(
  'review/update',
  async (
    review: { reviewData: WriteType; storeId: string; reviewId: number },
    thunkApi
  ) => {
    const { reviewData, storeId, reviewId } = review
    try {
      return await ReviewService.updateReview(reviewData, storeId, reviewId)
    } catch (error) {
      const message = ErrorService.axiosErrorHandler(error)
      return thunkApi.rejectWithValue(message)
    }
  }
)

export const deleteReview = createAsyncThunk(
  'review/delete',
  async (deleteReviewInfo: { storeId: string; reviewId: number }, thunkApi) => {
    const { storeId, reviewId } = deleteReviewInfo
    try {
      return await ReviewService.deleteReview(storeId, reviewId)
    } catch (error) {
      const message = ErrorService.axiosErrorHandler(error)
      return thunkApi.rejectWithValue(message)
    }
  }
)

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    selectReview: (state, action) => {
      state.selectedReview = state.reviews.find(
        (item) => item.reviewEntryNo === Number(action.payload)
      )
    },
    initReviews: (state) => {
      state.reviews = []
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchAllReviews.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchAllReviews.fulfilled,
      (state, action: PayloadAction<ReviewType[]>) => {
        const newReviews = [...state.reviews, ...action.payload].filter(
          (review, idx) => {
            return (
              [...state.reviews, ...action.payload].findIndex((review1) => {
                return review.reviewEntryNo === review1.reviewEntryNo
              }) === idx
            )
          }
        )
        state.loading = false
        state.reviews = newReviews
      }
    )
    builder.addCase(fetchAllReviews.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? ''
    })
    builder.addCase(createReview.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createReview.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(createReview.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? ''
    })
    builder.addCase(updateReview.pending, (state) => {
      state.loading = true
    })
    builder.addCase(updateReview.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(updateReview.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? ''
    })
    builder.addCase(deleteReview.pending, (state) => {
      state.loading = true
    })
    builder.addCase(deleteReview.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(deleteReview.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? ''
    })
  },
})

const reviewReducerSelect = (state: RootState) => state.review

export const reviewsSelect = createSelector(
  [reviewReducerSelect],
  (review) => review.reviews
)

export const selectedReviewSelect = createSelector(
  [reviewReducerSelect],
  (review) => review.selectedReview
)

export const reviewLoadingSelect = createSelector(
  [reviewReducerSelect],
  (review) => review.loading
)

export const { selectReview, initReviews } = reviewSlice.actions
export default reviewSlice.reducer
