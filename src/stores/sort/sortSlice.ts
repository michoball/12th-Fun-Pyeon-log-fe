import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@stores/store'

export interface ListInfo {
  searchedCoord: { lat: number; lng: number } | null
  brandData: string[]
  keywordData: string[]
}
const initialState: ListInfo = {
  searchedCoord: null,
  brandData: [],
  keywordData: [],
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
    resetSort: (state) => {
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
export const searchedCoordSelect = createSelector(
  [sortReducerSelect],
  (sort) => sort.searchedCoord
)

export const { saveBrand, saveKeyword, setSearchedCoord, resetSort } =
  sortSlice.actions
export default sortSlice.reducer
