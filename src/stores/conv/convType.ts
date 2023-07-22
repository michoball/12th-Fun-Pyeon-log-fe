export interface ConvType extends kakao.maps.services.PlacesSearchResultItem {
  storeId: string
  starCount: number
  reviewCount: number
  keywordList: string[]
  customDistance: number
}

export interface FilterType {
  brand: string[]
  keyword: string[]
}

export interface ConvState {
  stores: ConvType[]
  sortedStores: ConvType[]
  clickedStore: ConvType | null
  loading: boolean
  error: string
}
