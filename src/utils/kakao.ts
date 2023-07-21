import cuMarker from '../assets/brandMaker/cuMaker.png'
import emartMarker from '../assets/brandMaker/emartMaker.png'
import gsMarker from '../assets/brandMaker/gsMaker.png'
import miniMarker from '../assets/brandMaker/ministopMaker.png'
import sevenMarker from '../assets/brandMaker/sevenMaker.png'
import cuImg from '../assets/convImg/cu.png'
import emartImg from '../assets/convImg/emart.png'
import gsImg from '../assets/convImg/gs.png'
import ministopImg from '../assets/convImg/ministop.png'
import sevenImg from '../assets/convImg/seven.png'

export enum CUSTOM_MARKER_CLASS {
  gs = 'GS25',
  cu = 'CU',
  mini = '미니스톱',
  seven = '세븐일레븐',
  emart = '이마트24',
}

// 마커 이미지 선택기
export const getMarkerImg = (kakaoService: typeof kakao, placeName: string) =>
  ({
    [CUSTOM_MARKER_CLASS.gs]: new kakaoService.maps.MarkerImage(
      gsMarker,
      new kakaoService.maps.Size(30, 40)
    ),
    [CUSTOM_MARKER_CLASS.cu]: new kakaoService.maps.MarkerImage(
      cuMarker,
      new kakaoService.maps.Size(30, 40)
    ),
    [CUSTOM_MARKER_CLASS.mini]: new kakaoService.maps.MarkerImage(
      miniMarker,
      new kakaoService.maps.Size(30, 40)
    ),
    [CUSTOM_MARKER_CLASS.seven]: new kakaoService.maps.MarkerImage(
      sevenMarker,
      new kakaoService.maps.Size(30, 40)
    ),
    [CUSTOM_MARKER_CLASS.emart]: new kakaoService.maps.MarkerImage(
      emartMarker,
      new kakaoService.maps.Size(30, 40)
    ),
  }[placeName])

// 브랜드 이미지 선택기
export const getBrandImg = (placeName: string) =>
  ({
    [CUSTOM_MARKER_CLASS.gs]: gsImg,
    [CUSTOM_MARKER_CLASS.cu]: cuImg,
    [CUSTOM_MARKER_CLASS.mini]: ministopImg,
    [CUSTOM_MARKER_CLASS.seven]: sevenImg,
    [CUSTOM_MARKER_CLASS.emart]: emartImg,
  }[placeName])

export const kakaoCategorySearch = (
  mapApi: kakao.maps.Map,
  callbackFn: (
    mapData: kakao.maps.services.PlacesSearchResult,
    lat: number,
    lng: number
  ) => void
) => {
  const kakaoPlace = new kakao.maps.services.Places(mapApi)
  kakaoPlace.categorySearch(
    'CS2',
    (mapData, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const lat = mapApi.getCenter().getLat()
        const lng = mapApi.getCenter().getLng()

        callbackFn(mapData, lat, lng)
      } else {
        alert(
          '주변에 편의점이 존재하지 않습니다. 다른 곳을 검색하시거나, 더 높은 범위에서 찾아보세요.'
        )
      }
    },
    {
      location: mapApi.getCenter(),
      sort: kakao.maps.services.SortBy.DISTANCE,
      useMapBounds: true,
    }
  )
}

export const kakaoKeywordSearch = (
  mapApi: kakao.maps.Map,
  searchTerm: string,
  callbackFn: (
    mapData: kakao.maps.services.PlacesSearchResult,
    lat: number,
    lng: number
  ) => void
) => {
  const kakaoPlace = new kakao.maps.services.Places(mapApi)

  kakaoPlace.keywordSearch(`${searchTerm} 편의점`, (mapData, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const bounds = new kakao.maps.LatLngBounds()
      for (let i = 0; i < mapData.length; i++) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        bounds.extend(
          new kakao.maps.LatLng(Number(mapData[i].y), Number(mapData[i].x))
        )
      }
      mapApi.setBounds(bounds)

      // 센터 찾아서 가운데 위치 찾고 마커 표시
      const lat = mapApi.getCenter().getLat()
      const lng = mapApi.getCenter().getLng()

      callbackFn(mapData, lat, lng)
    } else {
      alert(
        `${searchTerm} 편의점이 존재하지 않습니다. 다른 이름으로 검색해주세요`
      )
    }
  })
}
