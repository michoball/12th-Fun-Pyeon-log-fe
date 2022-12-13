import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { getMapThunk } from './mapThunk'
import { MapState } from './mapType'

const initialState: MapState = {
  data: [],
  loading: false,
  error: false,
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    getData: (
      state,
      action: PayloadAction<kakao.maps.services.PlacesSearchResultItem[]>
    ) => {
      state.data = action.payload
      // console.log(action.payload)
    },
    removeData: (state) => {
      state.data = []
    },
  },
  extraReducers(builder) {
    // builder.addCase(getMapThunk.pending, (state) => {
    //   state.loading = true
    //   state.error = false
    // })
    // builder.addCase(
    //   getMapThunk.fulfilled,
    //   (state, action: PayloadAction<MapData[]>) => {
    //     state.data = action.payload
    //     state.loading = false
    //     state.error = false
    //   }
    // )
    // builder.addCase(getMapThunk.rejected, (state) => {
    //   state.loading = false
    //   state.error = true
    // })
  },
})

// export { getMapThunk }
export const { getData, removeData } = mapSlice.actions
export default mapSlice.reducer
