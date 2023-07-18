export interface ConvType extends kakao.maps.services.PlacesSearchResultItem {
  storeId: string
  starCount: number
  reviewCount: number
  keywordList: string[]
  customDistance: number
}

export interface MarkerConv {
  placeName: string
  storeId: string
  address: string
  phoneNumber: string
  reviewCount: number
  starCount: number
}

export interface ConvState {
  stores: ConvType[]
  sortedStores: ConvType[]
  selectedStore: ConvType | null
  clickedStore: MarkerConv | null
  sortType: 'star' | 'review' | 'distance'
  loading: boolean
  error: string
}
