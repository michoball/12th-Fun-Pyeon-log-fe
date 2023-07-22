import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConvType } from '@stores/conv/convType'
import { RootState } from '@stores/store'

export interface ListInfo {
  searchedCoord: { lat: number; lng: number } | null
  brandData: string[]
  keywordData: string[]
  sortType: 'star' | 'review' | 'distance'
}
const initialState: ListInfo = {
  searchedCoord: null,
  brandData: [],
  keywordData: [],
  sortType: 'distance',
}

export const storeSortAction = (
  sortType: 'star' | 'review' | 'distance',
  data: ConvType[]
) => {
  switch (sortType) {
    case 'star':
      return data.sort((a, b) => b.starCount - a.starCount)
    case 'review':
      return data.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'distance':
      return data.sort((a, b) => Number(a.distance) - Number(b.distance))
    default:
      return data
  }
}

const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    setSearchedCoord: (
      state,
      action: PayloadAction<{ lat: number; lng: number } | null>
    ) => {
      state.searchedCoord = action.payload
    },
    saveBrand: (state, action: PayloadAction<string[]>) => {
      state.brandData = action.payload
    },
    saveKeyword: (state, action: PayloadAction<string[]>) => {
      state.keywordData = action.payload
    },
    saveSortType: (
      state,
      action: PayloadAction<'star' | 'review' | 'distance'>
    ) => {
      state.sortType = action.payload
    },
    resetFilter: (state) => {
      state.keywordData = initialState.keywordData
      state.brandData = initialState.brandData
    },
  },
})

const sortReducerSelect = (state: RootState) => state.sort

export const brandSelect = createSelector(
  [sortReducerSelect],
  (sort) => sort.brandData
)

export const keywordSelect = createSelector(
  [sortReducerSelect],
  (sort) => sort.keywordData
)
export const sortTypeSelect = createSelector(
  [sortReducerSelect],
  (sort) => sort.sortType
)

export const searchedCoordSelect = createSelector(
  [sortReducerSelect],
  (sort) => sort.searchedCoord
)

export const {
  setSearchedCoord,
  resetFilter,
  saveBrand,
  saveKeyword,
  saveSortType,
} = sortSlice.actions
export default sortSlice.reducer
