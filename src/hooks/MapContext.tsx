import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import { ConvType } from '@stores/conv/convType'
import { DEFAULT_KAKAO_COORD } from '@utils/constants'
import { getMarkerImg } from '@utils/kakao'
import funMarker from '../assets/brandMaker/funlogMaker.png'
import myMarker from '../assets/brandMaker/myMarker.svg'

interface MapContextType {
  mapApi: kakao.maps.Map | null
  selectedMarkerId: string
  storeOverlay: kakao.maps.CustomOverlay | null
  setMapApi: React.Dispatch<React.SetStateAction<kakao.maps.Map | null>>
  setOverlay: () => void
  deleteMarkers: () => void
  setMyMarker: (storeBrand?: string) => void
  markerResetting: (data: ConvType[]) => void
}

export const MapContext = createContext<MapContextType>({
  mapApi: null,
  selectedMarkerId: '',
  storeOverlay: null,
  setMapApi: (newMap) => {},
  setOverlay: () => {},
  deleteMarkers: () => {},
  setMyMarker: (brand) => {},
  markerResetting: (data) => {},
})

const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [mapApi, setMapApi] = useState<kakao.maps.Map | null>(null)
  const [, setNewMarkers] = useState<kakao.maps.Marker[]>([])
  const [selectedMarkerId, setSelectedMarkerId] = useState('')

  const storeOverlay = useRef<kakao.maps.CustomOverlay | null>(null)
  const infoOverlay = useRef<kakao.maps.CustomOverlay | null>(null)

  const setOverlay = () => {
    storeOverlay.current = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(
        DEFAULT_KAKAO_COORD.lat,
        DEFAULT_KAKAO_COORD.lng
      ),
      zIndex: 1,
    })

    infoOverlay.current = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(
        DEFAULT_KAKAO_COORD.lat,
        DEFAULT_KAKAO_COORD.lng
      ),
      zIndex: 1,
    })
  }

  const setMarker = useCallback(
    (data: ConvType, map: kakao.maps.Map) => {
      const [storeBrand] = data.place_name.split(' ')
      const markerImg =
        getMarkerImg(kakao, storeBrand) ??
        new kakao.maps.MarkerImage(funMarker, new kakao.maps.Size(30, 40))
      const markerCenter = new kakao.maps.LatLng(+data.y, +data.x)

      // 마커를 생성하고 지도에 표시합니다
      const newMarker = new kakao.maps.Marker({
        position: markerCenter,
        image: markerImg,
      })

      const content = `<div class="infoOverlay">${data.place_name}</div>`

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(newMarker, 'click', () => {
        if (storeOverlay.current) {
          storeOverlay.current.setPosition(markerCenter)
          storeOverlay.current.setContent('<div id="kakao-overlay"></div>')
          storeOverlay.current.setMap(map)
        }
        setSelectedMarkerId(data.id)
        map.panTo(markerCenter)
      })

      // 마커에 마우스오버 이벤트를 등록합니다
      kakao.maps.event.addListener(newMarker, 'mouseover', () => {
        if (infoOverlay.current) {
          infoOverlay.current.setContent(content)
          infoOverlay.current.setPosition(markerCenter)
          infoOverlay.current.setMap(map)
        }
      })
      // 마커에 마우스아웃 이벤트를 등록합니다
      kakao.maps.event.addListener(newMarker, 'mouseout', () => {
        if (infoOverlay.current) {
          infoOverlay.current.setMap(null)
        }
      })

      setNewMarkers((prev) => {
        if (prev.length >= 16) {
          return prev
        }
        newMarker.setMap(map)
        return [...prev, newMarker]
      })
    },
    [setNewMarkers]
  )

  const displayMyLocation = useCallback(
    (storeBrand?: string) => {
      if (!infoOverlay.current || !mapApi) return
      const mapCenter = mapApi.getCenter()
      const content = `<div class="infoOverlay ${storeBrand ? '' : 'me'} ">${
        storeBrand ? ' ' : 'YOU'
      }</div>`

      infoOverlay.current.setContent(content)
      infoOverlay.current.setPosition(mapCenter)
      infoOverlay.current.setMap(mapApi)

      const markerImg =
        storeBrand && storeBrand.length > 0
          ? getMarkerImg(kakao, storeBrand) ??
            new kakao.maps.MarkerImage(funMarker, new kakao.maps.Size(30, 40))
          : new kakao.maps.MarkerImage(myMarker, new kakao.maps.Size(20, 20))

      // 마커를 생성합니다
      const marker = new kakao.maps.Marker({
        map: mapApi,
        position: mapCenter,
        image: markerImg,
      })

      return marker
    },
    [mapApi]
  )
  const setMyMarker = useCallback(
    (storeBrand?: string) => {
      const myMarker = displayMyLocation(storeBrand)
      if (myMarker) {
        setNewMarkers((prev) => {
          if (prev.length > 17) {
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

  const markerResetting = useCallback(
    (data: ConvType[]) => {
      if (!mapApi) return
      deleteMarkers()
      data.forEach((list) => {
        setMarker(list, mapApi)
      })
      setMyMarker()
    },
    [mapApi, setMarker, deleteMarkers, setMyMarker]
  )

  const value = {
    mapApi,
    selectedMarkerId,
    storeOverlay: storeOverlay.current,
    setMapApi,
    deleteMarkers,
    setSelectedMarkerId,
    setMyMarker,
    setOverlay,
    markerResetting,
  }

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

export const useKakaoMap = () => useContext(MapContext)

export default MapProvider
