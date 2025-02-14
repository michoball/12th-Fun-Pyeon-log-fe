import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit'
import ErrorService from '@services/errorService'
import StoreService from '@services/storeService'
import { RootState } from '@stores/store'
import { BRANDS } from '@utils/constants'
import { ConvState, ConvType } from './convType'

const initialState: ConvState = {
  stores: [],
  sortedStores: [],
  clickedStore: null,
  loading: false,
  error: '',
}

export const storeFilterAction = (
  brand: string[],
  keyword: string[],
  data: ConvType[]
) => {
  let filteredStore: ConvType[]

  if (!brand.length) {
    filteredStore = [...data]
  } else if (brand.includes('기타')) {
    const notSelectedBrand = BRANDS.filter((brand) => !brand.includes(brand))
    filteredStore = data.filter(
      (data) => !notSelectedBrand.includes(data.place_name.split(' ')[0])
    )
  } else {
    filteredStore = data.filter((data) =>
      brand.includes(data.place_name.split(' ')[0])
    )
  }

  if (keyword.length) {
    return filteredStore.filter((data) =>
      data.keywordList.some((keyword) => keyword.includes(keyword))
    )
  } else {
    return filteredStore
  }
}

// 검색된 전체 편의점에 대한 정보 가져오기
export const fetchAllStores = createAsyncThunk(
  'convStore/fetchAllStores',
  async (
    mapInfo: {
      mapData: kakao.maps.services.PlacesSearchResult
    },
    thunkApi
  ) => {
    const { mapData } = mapInfo
    try {
      const storeIds = mapData.map((result) => result.id)
      const stores = await StoreService.getAllStore(storeIds)

      const storeData = stores.map((data) => {
        const [matchStore] = mapData.filter(
          (store) => store.id === data.storeId
        )
        return { ...data, ...matchStore }
      })
      return storeData
    } catch (error) {
      const message = ErrorService.axiosErrorHandler(error)
      return thunkApi.rejectWithValue(message)
    }
  }
)

// 클릭한 한개의 편의점에 대한 정보 가져오기
export const fetchStoreInfo = createAsyncThunk<
  ConvType,
  { storeId: string; searchedStore: kakao.maps.services.PlacesSearchResult },
  { state: RootState }
>(
  'convStore/fetchStore',
  async (
    storeData: {
      storeId: string
      searchedStore: kakao.maps.services.PlacesSearchResult
    },
    thunkApi
  ) => {
    try {
      const { stores } = thunkApi.getState().conv
      const { storeId, searchedStore } = storeData

      const storeInfo = await StoreService.getStore(storeId)

      const result =
        searchedStore.length > 0
          ? { ...searchedStore[0], ...storeInfo }
          : {
              ...stores.filter((store) => store.id === storeId)[0],
              ...storeInfo,
            }
      return result
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
        state.clickedStore = initialState.clickedStore
      }
    )
    builder.addCase(fetchAllStores.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? ''
    })
    builder.addCase(fetchStoreInfo.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchStoreInfo.fulfilled,
      (state, action: PayloadAction<ConvType>) => {
        state.loading = false
        state.clickedStore = action.payload
      }
    )
    builder.addCase(fetchStoreInfo.rejected, (state, action) => {
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

export const convloadingSelect = createSelector(
  [convReducerSelect],
  (conv) => conv.loading
)

export const clickedStoreSelect = createSelector(
  [convReducerSelect],
  (conv) => conv.clickedStore
)

export const sortedStoreSelect = createSelector(
  [convReducerSelect],
  (conv) => conv.sortedStores
)

export const { setClickedStore } = convSlice.actions

export default convSlice.reducer
