import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit'
import ErrorService from '@services/errorService'
import StoreService from '@services/storeService'
import { RootState } from '@stores/store'
import { calcDistance } from '@utils/calc'
import { BRANDS } from '@utils/constants'
import { ConvState, ConvType, FilterType } from './convType'

const initialState: ConvState = {
  stores: [],
  sortedStores: [],
  clickedStore: null,
  sortType: 'distance',
  loading: false,
  error: '',
}

// 검색된 전체 편의점에 대한 정보 가져오기
export const fetchAllStores = createAsyncThunk(
  'convStore/fetchAllStores',
  async (
    mapInfo: {
      mapData: kakao.maps.services.PlacesSearchResult
      lat: number
      lng: number
    },
    thunkApi
  ) => {
    const { mapData, lat, lng } = mapInfo
    try {
      const storeIds = mapData.map((result) => result.id)
      const stores = await StoreService.getAllStore(storeIds)

      const storeData = stores.map((data) => {
        const [matchStore] = mapData.filter(
          (store) => store.id === data.storeId
        )
        if (matchStore.distance) {
          return { ...data, ...matchStore }
        }
        const customDistance = calcDistance(
          lat,
          lng,
          Number(matchStore.y),
          Number(matchStore.x)
        )
        return { ...data, ...matchStore, distance: String(customDistance) }
      })
      return storeData
    } catch (error) {
      const message = ErrorService.axiosErrorHandler(error)
      return thunkApi.rejectWithValue(message)
    }
  }
)

const convSlice = createSlice({
  name: 'conv',
  initialState,
  reducers: {
    setClickedStore: (state, action: PayloadAction<string>) => {
      const clickedId = action.payload
      const selectedStore = state.sortedStores.filter(
        (store) => store.id === clickedId
      )[0]
      state.clickedStore = selectedStore
    },
    setSortStores: (state, action: PayloadAction<ConvType[]>) => {
      state.sortedStores = action.payload
    },
    setSortType: (
      state,
      action: PayloadAction<'star' | 'review' | 'distance'>
    ) => {
      state.sortType = action.payload
    },
    filterStore: (state, action: PayloadAction<FilterType>) => {
      const { stores } = state

      const { brand, keyword } = action.payload
      let filteredStore: ConvType[]
      if (!brand.length) {
        filteredStore = [...stores]
      } else if (brand.includes('기타')) {
        const notSelectedBrand = BRANDS.filter(
          (brand) => !brand.includes(brand)
        )
        filteredStore = stores.filter(
          (data) => !notSelectedBrand.includes(data.place_name.split(' ')[0])
        )
      } else {
        filteredStore = stores.filter((data) =>
          brand.includes(data.place_name.split(' ')[0])
        )
      }
      state.sortedStores = keyword.length
        ? filteredStore.filter((data) =>
            data.keywordList.some((keyword) => keyword.includes(keyword))
          )
        : filteredStore
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchAllStores.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchAllStores.fulfilled,
      (state, action: PayloadAction<ConvType[]>) => {
        state.loading = false
        state.stores = action.payload
        state.sortedStores = action.payload
      }
    )
    builder.addCase(fetchAllStores.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? ''
    })
  },
})

const convReducerSelect = (state: RootState) => state.conv

export const convSelect = createSelector(
  [convReducerSelect],
  (conv) => conv.stores
)

export const convSortTypeSelect = createSelector(
  [convReducerSelect],
  (conv) => conv.sortType
)
export const convloadingSelect = createSelector(
  [convReducerSelect],
  (conv) => conv.loading
)

export const clickedStoreSelect = createSelector(
  [convReducerSelect],
  (conv) => conv.clickedStore
)

export const sortedConvSelect = createSelector([convReducerSelect], (conv) => {
  const { sortedStores, sortType } = conv
  const convs = [...sortedStores]
  switch (sortType) {
    case 'star':
      return convs.sort((a, b) => b.starCount - a.starCount)
    case 'review':
      return convs.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'distance':
      return convs.sort((a, b) => Number(a.distance) - Number(b.distance))
  }
})

export const { setClickedStore, setSortType, filterStore, setSortStores } =
  convSlice.actions

export default convSlice.reducer
