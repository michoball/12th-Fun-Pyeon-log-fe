import React, { createContext, useCallback, useRef, useState } from 'react'
import { getMarkerImg } from '@services/markerImg'
import { setClickedStore } from '@stores/conv/convSlice'
import { ConvType } from '@stores/conv/convType'
import { useAppDispatch } from '@stores/store'
import { DEFAULT_KAKAO_COORD } from '@utils/constants'
import funMarker from '../assets/brandMaker/funlogMaker.png'
import myMarker from '../assets/brandMaker/myMarker.svg'

interface MapContextType {
  mapApi: kakao.maps.Map | null
  selectedMarker: kakao.maps.Marker | null
  kakaoService: typeof kakao | null
  storeOverlay: kakao.maps.CustomOverlay | null
  infoOverlay: kakao.maps.CustomOverlay | null
  setMapApi: React.Dispatch<React.SetStateAction<kakao.maps.Map | null>>
  setKakao: (newKakao: typeof kakao) => void
  setMarkers: (data: ConvType, map: kakao.maps.Map) => void
  displayMyLocation: (
    kakaoService: typeof kakao,
    storeBrand?: string
  ) => kakao.maps.Marker | undefined
  deleteMarkers: () => void
  setMyMarker: (kakaoService: typeof kakao) => void
}

export const MapContext = createContext<MapContextType>({
  mapApi: null,
  selectedMarker: null,
  kakaoService: null,
  storeOverlay: null,
  infoOverlay: null,
  setMapApi: (newMap) => {},
  setKakao: (kakao) => {},
  displayMyLocation: (kakao, brand) => {
    return undefined
  },
  setMarkers: (data, map) => {},
  deleteMarkers: () => {},
  setMyMarker: (kakao) => {},
})

const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [mapApi, setMapApi] = useState<kakao.maps.Map | null>(null)
  const [kakaoService, setkakaoService] = useState<typeof kakao | null>(null)
  const [, setNewMarkers] = useState<kakao.maps.Marker[]>([])
  const [selectedMarker, setSelectedMarker] =
    useState<kakao.maps.Marker | null>(null)

  const storeOverlay = useRef<kakao.maps.CustomOverlay | null>(null)
  const infoOverlay = useRef<kakao.maps.CustomOverlay | null>(null)

  const dispatch = useAppDispatch()

  const setKakao = useCallback((newKakao: typeof kakao) => {
    if (!storeOverlay.current && !infoOverlay.current) {
      storeOverlay.current = new newKakao.maps.CustomOverlay({
        position: new newKakao.maps.LatLng(
          DEFAULT_KAKAO_COORD.lat,
          DEFAULT_KAKAO_COORD.lng
        ),
        zIndex: 1,
      })

      infoOverlay.current = new newKakao.maps.CustomOverlay({
        position: new newKakao.maps.LatLng(
          DEFAULT_KAKAO_COORD.lat,
          DEFAULT_KAKAO_COORD.lng
        ),
        zIndex: 1,
      })
      setkakaoService(newKakao)
    }
  }, [])

  const setMarkers = useCallback(
    (data: ConvType, map: kakao.maps.Map) => {
      if (!kakaoService) return
      const [storeBrand] = data.place_name.split(' ')
      const markerImg =
        getMarkerImg(kakaoService, storeBrand) ??
        new kakaoService.maps.MarkerImage(
          funMarker,
          new kakaoService.maps.Size(30, 40)
        )
      const markerCenter = new kakaoService.maps.LatLng(+data.y, +data.x)

      // 마커를 생성하고 지도에 표시합니다
      const newMarker = new kakaoService.maps.Marker({
        position: markerCenter,
        image: markerImg,
      })

      const content = `<div class="infoOverlay">${data.place_name}</div>`

      // 마커에 클릭이벤트를 등록합니다
      kakaoService.maps.event.addListener(newMarker, 'click', () => {
        dispatch(
          setClickedStore({
            placeName: data.place_name,
            storeId: data.id,
            address: data.address_name,
            phoneNumber: data.phone,
            reviewCount: data.reviewCount,
            starCount: data.starCount,
          })
        )
        if (storeOverlay.current) {
          storeOverlay.current.setPosition(markerCenter)
          storeOverlay.current.setContent('<div id="kakao-overlay"></div>')
          storeOverlay.current.setMap(map)
        }
        newMarker.setTitle(data.id)
        setSelectedMarker(newMarker)
        map.panTo(markerCenter)
      })

      // 마커에 마우스오버 이벤트를 등록합니다
      kakaoService.maps.event.addListener(newMarker, 'mouseover', () => {
        if (infoOverlay.current) {
          infoOverlay.current.setContent(content)
          infoOverlay.current.setPosition(markerCenter)
          infoOverlay.current.setMap(map)
        }
      })
      // 마커에 마우스아웃 이벤트를 등록합니다
      kakaoService.maps.event.addListener(newMarker, 'mouseout', () => {
        if (infoOverlay.current) {
          infoOverlay.current.setMap(null)
        }
      })

      newMarker.setMap(map)
      setNewMarkers((prev) => {
        if (prev.length >= 16) {
          return prev
        }
        return [...prev, newMarker]
      })
    },
    [dispatch, setNewMarkers, kakaoService]
  )
  const displayMyLocation = useCallback(
    (kakaoService: typeof kakao, storeBrand?: string) => {
      if (!infoOverlay.current || !mapApi) return
      infoOverlay.current.setMap(null)
      const mapCenter = mapApi.getCenter()
      const content = `<div class="infoOverlay ${storeBrand ? '' : 'me'} ">${
        storeBrand ? ' ' : 'YOU'
      }</div>`

      infoOverlay.current.setContent(content)
      infoOverlay.current.setPosition(mapCenter)
      infoOverlay.current.setMap(mapApi)

      const markerImg =
        storeBrand && storeBrand.length > 0
          ? getMarkerImg(kakaoService, storeBrand) ??
            new kakao.maps.MarkerImage(funMarker, new kakao.maps.Size(30, 40))
          : new kakao.maps.MarkerImage(myMarker, new kakao.maps.Size(20, 20))

      // 마커를 생성합니다
      const marker = new kakaoService.maps.Marker({
        map: mapApi,
        position: mapCenter,
        image: markerImg,
      })

      return marker
    },
    [mapApi]
  )
  const setMyMarker = useCallback(
    (kakaoService: typeof kakao) => {
      const myMarker = displayMyLocation(kakaoService)
      if (myMarker) {
        setNewMarkers((prev) => {
          if (prev.length >= 17) {
            storeOverlay.current?.setMap(null)
            myMarker?.setMap(null)
            return prev
          }
          return [...prev, myMarker]
        })
      }
    },
    [displayMyLocation]
  )

  const deleteMarkers = useCallback(() => {
    setNewMarkers((prev) => {
      prev.forEach((markerInfo) => {
        markerInfo?.setMap(null)
      })
      return []
    })
  }, [])

  const value = {
    mapApi,
    kakaoService,
    selectedMarker,
    storeOverlay: storeOverlay.current,
    infoOverlay: infoOverlay.current,
    setMapApi,
    setMarkers,
    deleteMarkers,
    setSelectedMarker,
    setMyMarker,
    setKakao,
    displayMyLocation,
  }

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

export default MapProvider
