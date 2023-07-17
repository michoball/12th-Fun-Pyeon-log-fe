import { OverlayProps } from '@components/Overlay/Overlay'
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
import { ConvState, ConvType } from './convType'

const initialState: ConvState = {
  stores: [],
  sortedStores: [],
  selectedStore: null,
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
      return storeData.sort((a, b) => Number(a.distance) - Number(b.distance))
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
    setClickedStore: (state, action: PayloadAction<OverlayProps>) => {
      state.clickedStore = action.payload
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
    builder.addCase(fetchStoreInfo.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchStoreInfo.fulfilled,
      (state, action: PayloadAction<ConvType>) => {
        state.loading = false
        state.selectedStore = action.payload
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

export const convSortTypeSelect = createSelector(
  [convReducerSelect],
  (conv) => conv.sortType
)
export const selectedConvSelect = createSelector(
  [convReducerSelect],
  (conv) => conv.selectedStore
)
export const convloadingSelect = createSelector(
  [convReducerSelect],
  (conv) => conv.loading
)

export const sortedConvSelect = createSelector([convReducerSelect], (conv) => {
  const type = conv.sortType
  const convs = [...conv.sortedStores]
  switch (type) {
    case 'star':
      return convs.sort((a, b) => b.starCount - a.starCount)
    case 'review':
      return convs.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'distance':
      return convs.sort((a, b) => Number(a.distance) - Number(b.distance))
    default:
      return convs
  }
})

export const { setSortStores, setClickedStore, setSortType } = convSlice.actions

export default convSlice.reducer
