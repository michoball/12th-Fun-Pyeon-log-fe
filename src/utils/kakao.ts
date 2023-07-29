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
// import { calcDistance } from './calc'

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
      const lat = mapApi.getCenter().getLat()
      const lng = mapApi.getCenter().getLng()
      for (let i = 0; i < mapData.length; i++) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        const customDistance = calcDistance(
          lat,
          lng,
          Number(mapData[i].y),
          Number(mapData[i].x)
        )
        bounds.extend(
          new kakao.maps.LatLng(Number(mapData[i].y), Number(mapData[i].x))
        )
        mapData[i].distance = customDistance
      }
      mapApi.setBounds(bounds)
      const newLat = mapApi.getCenter().getLat()
      const newLng = mapApi.getCenter().getLng()
      // 센터 찾아서 가운데 위치 찾고 마커 표시
      callbackFn(mapData, newLat, newLng)
    } else {
      alert(
        `${searchTerm} 편의점이 존재하지 않습니다. 다른 이름으로 검색해주세요`
      )
    }
  })
}

const calcDistance = (lat: number, lng: number, lat2: number, lng2: number) => {
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat) // deg2rad below
  const dLon = deg2rad(lng2 - lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = (R * c).toFixed(4) // Distance in km

  return d
}
