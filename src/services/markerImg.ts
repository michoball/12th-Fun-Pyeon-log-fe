import GsMarker from '../assets/brandMaker/gsMaker.png'
import cuMarker from '../assets/brandMaker/cuMaker.png'
import miniMarker from '../assets/brandMaker/ministopMaker.png'
import sevenMarker from '../assets/brandMaker/sevenMaker.png'
import emartMarker from '../assets/brandMaker/emartMaker.png'
import funMarker from '../assets/brandMaker/funlogMaker.png'
import gsImg from '../assets/convImg/gs.png'
import cuImg from '../assets/convImg/cu.png'
import emartImg from '../assets/convImg/emart.png'
import ministopImg from '../assets/convImg/ministop.png'
import sevenImg from '../assets/convImg/seven.png'

export enum CUSTOM_MARKER_CLASS {
  gs = 'GS25',
  cu = 'CU',
  mini = '미니스톱',
  seven = '세븐일레븐',
  emart = '이마트24',
}

// 사용자 개인 마커 샘플이미지
export const customMarkerImage = {
  myMarkerImg: new kakao.maps.MarkerImage(
    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
    new kakao.maps.Size(31, 35)
  ),
  gsMarkerImg: new kakao.maps.MarkerImage(
    GsMarker,
    new kakao.maps.Size(30, 40)
  ),
  cuMarkerImg: new kakao.maps.MarkerImage(
    cuMarker,
    new kakao.maps.Size(30, 40)
  ),
  miniMarkerImg: new kakao.maps.MarkerImage(
    miniMarker,
    new kakao.maps.Size(30, 40)
  ),
  sevenMarkerImg: new kakao.maps.MarkerImage(
    sevenMarker,
    new kakao.maps.Size(30, 40)
  ),
  emartMarkerImg: new kakao.maps.MarkerImage(
    emartMarker,
    new kakao.maps.Size(30, 40)
  ),
  funMarkerImg: new kakao.maps.MarkerImage(
    funMarker,
    new kakao.maps.Size(30, 40)
  ),
}
