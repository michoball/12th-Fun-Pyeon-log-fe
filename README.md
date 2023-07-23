<br>
<p align="center"><img src="https://user-images.githubusercontent.com/91148531/209321821-f21c3ec8-0b49-4e3c-831a-886136ecf88e.png" width="100%"/></p>

`개인 리펙토링한 버전입니다`

# **나만의 편의점 찾기 플랫폼 - **Fun편log - ** (FE)**

### **🏠 _배포 주소_** [https://reliable-khapse-798e03.netlify.app/](https://reliable-khapse-798e03.netlify.app/)

## 실행 방법

```sh
git clone // this repository
cd this file location
npm install
npm start
# front : http://localhost:3000
```

<p align="center"><img src="https://user-images.githubusercontent.com/91148531/209322976-be25100d-eb57-4432-97dd-e28c6837f10c.png" width="100%"/></p>

### [팀 깃허브](https://github.com/Couch-Coders/12th-Fun-Pyeon-log-fe) / [🎥시연 영상 Youtube Link](https://www.youtube.com/watch?v=xDyhkX3ZDkw)

## ⏰ 리펙토링 기간

- 2022.07.14 ~ 2022.07.22

# 개선 사항

### 1. 카카오 지도 동적로드

기존 index.html 내 script 태그로 넣어둔 kakao map sdk 기능 동적으로 로드 되도록

App.tsx에서 다룸

```typescript
useEffect(() => {
  // API 스크립트 로드
  if (!isScriptLoaded && process.env.REACT_APP_KAKAO_API_KEY) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&libraries=services&autoload=false`

    script.onload = () => {
      console.log('스크립트 로드 ')
      setIsScriptLoaded(true)
    }
    if (!document.querySelector(`script[src="${script.src}"]`)) {
      document.body.appendChild(script)
    }
  }
}, [isScriptLoaded])
```

### 2. 편의점 필터링 및 정렬 값 유지 이슈 해결

- 편의점 브랜드명, 유저 키워드 별 필터링
- 거리, 리뷰 수, 별점 수 정렬

위 두가지 값 중 새로고침 시

필터링 값이 유지는 되나 실제 검색된 편의점 리스트에 반영되지 않던 이슈 해결

```typescript
// main.tsx 중
useEffect(() => {
  const filteredStore = storeFilterAction(brandData, keywordData, sortedConv)
  setStores(filteredStore)
  markerResetting(filteredStore)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [sortedConv, markerResetting, brandData])
```

편의점 리스트 업데이트 시 필터링 상태값을 기준으로 storeFilterAction 함수 실행

필터링 값 적용된 값으로 state에 저장하여 보여줌

```ts

const ListBox: React.FC<ListBoxProps> = ({ stores }) => {
  const sortType = useAppSelector(sortTypeSelect)
  const sortedStores = useMemo(
    () => storeSortAction(sortType, stores),
    [sortType, stores]
  )

  return (
  {sortedStores.map((store) => (
            <List key={store}/>))}
  )
}
```

ListBox.tsx 에서 필터링 된 편의점들 props로 받음

이후 storeSortAction를 통해 정렬 값이 적용된 편의점 리스트로 render

### 3. 편의점 검색 함수 코드 개선

kakao.maps.services.Places() 를 사용한 키워드 검색 카테고리 검색 기능 개선

- 기존 하나의 searchStore 함수에 searchType 파라미터로 구분하여 수행하던 방식에서 키워드와 카테고리 각각 따로 함수구현

- 기존 함수내에 존재하던 dispatch 와 다른 부가 기능 제거 -> callback 함수를 파라미터로 받아 검색된 편의점에 대한 추가 작업 진행

기존 코드

```ts
// useSearchStore.tsx

const useSearchStore = () => {
  const dispatch = useAppDispatch()
  const { deleteMarkers } = useContext(MapContext)

  const searchStore = useCallback(
    (searchType: SearchType, mapApi: kakao.maps.Map, searchTerm?: string) => {
      // dispatch, deleteMarker 등 부수 작업 진행

      // 편의점 검색 타입에 따라 각각 다른 메서드 사용
      if (searchType === SearchType.KEYWORD && searchTerm) {
        // 키워드 검색 후 searchCallBack 함수 실행
      } else {
         // 카테고리 검색 후 searchCallBack 함수 실행
      }
    },
    [dispatch, searchCallBack, deleteMarkers]
  )

    const searchCallBack = useCallback(
    (
      data: kakao.maps.services.PlacesSearchResult,
      map: kakao.maps.Map,
      searchType: SearchType
    ) => {
      // 검색 타입을 계속 이용해 작업 수행
      if (searchType === SearchType.KEYWORD) {
      키워드 검색일 때 특정 작업수행
      }
     // 결과 값을 dispatch action으로 보내는 작업
    },
    [dispatch]
  )

  return { searchStore }
```

개선 코드

```ts
// utils/kakao.ts
// 키워드 검색
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

  kakaoPlace.keywordSearch(
    // 키워드 검색 진행
    // 결과값을 callbackFn에 전달
    callbackFn(mapData, lat, lng)
  )
}

// 카테고리 검색도 이와 유사
```

> 검색 기능의 가독성이 향상되고 함수의 관심사를 분리할 수 있었다

### 4. Redux devtool 실행시 앱 다운 이슈 해결

conv slice 에 있는 createAsyncThunk로 구현된 `fetchAllStores` 에 많고 불필요한 연산이 있어서

redux devtool 사용시 브라우져가 다운되는 이슈가 있었다.

`fetchAllStores` 함수에서 수행되는 연산을 다른 곳으로 분리하여 해당 함수의 부담을 줄여 해결 할 수 있었다.

기존 코드

```ts
// fetchAllStores 내부
const storeIds = mapData.map((result) => result.id)
const stores = await StoreService.getAllStore(storeIds)
const storeData = stores.map((data) => {
  const [matchStore] = mapData.filter((store) => store.id === data.storeId)
  const customDistance = calcDistance(
    map,
    Number(matchStore.y),
    Number(matchStore.x)
  )
  return { ...data, ...matchStore, customDistance }
})
if (storeData[0].distance) {
  return storeData.sort((a, b) => Number(a.distance) - Number(b.distance))
} else {
  return storeData.sort(
    (a, b) => Number(a.customDistance) - Number(b.customDistance)
  )
}
```

calcDistance 함수와 sort는 여기서 하지 않아도 되는 작업이다.

개선 코드

```ts
// fetchAllStores 내부
const storeIds = mapData.map((result) => result.id)
const stores = await StoreService.getAllStore(storeIds)

const storeData = stores.map((data) => {
  const [matchStore] = mapData.filter((store) => store.id === data.storeId)
  return { ...data, ...matchStore }
})
return storeData
```

> 함수의 부담을 줄이고 역할에 맞는 작업만을 진행하도록 개선하였다.

## 🛠️ **FrontEnd** 개발 환경

<p>
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&square&logo=TypeScript&logoColor=white"/>
 <img src="https://img.shields.io/badge/react-61DAFB?style=flat-square&logo=react&logoColor=white"/>
 <img src="https://img.shields.io/badge/React Router-CA4245?style=flat-square&logo=React Router&logoColor=white"/>
<img alt="Redux" src="https://img.shields.io/badge/Redux-764ABC?style=flat-square&logo=Redux&logoColor=white%22/%3E"/>
<img alt="Redux-toolkit" src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=Redux&logoColor=white%22/%3E"/>
<img src="https://img.shields.io/badge/styled-components-DB7093?style=flat-square&logo=styled-components&logoColor=white"/>
<img src="https://img.shields.io/badge/Ant Design -0170FE?style=flat-square&logo=Ant Design&logoColor=white"/>
<img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=Firebase&logoColor=white"/>
<img src="https://img.shields.io/badge/Oauth-4285F4?style=flat-square&logo=Google&logoColor=white"/>
</p>

### [FE 프로젝트 칸반보드](https://github.com/orgs/Couch-Coders/projects/10)

## 🛠️ 기획 및 설계

[기능 명세서](https://myunghun-kang.notion.site/FUN-log-2273ec05b91e43c9aa9d523fb6728e37)
<br>

[UI 기획서](https://myunghun-kang.notion.site/UI-fdced7beb00448028cbc4198cd9b338e)
<br>

[디자인](https://www.figma.com/file/AJXFCmrovkkRir7go0bx7V/%EC%B9%B4%EC%9A%B0%EC%B9%98-%ED%8C%80%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=1%3A5&t=AT7LfAxPeqF0Ua8G-1)
<br>

[DB 명세서](https://myunghun-kang.notion.site/DB-c1ba85b611a74e75b439f9da2c68571a)
<br>

[API 명세서](https://myunghun-kang.notion.site/API-a947cc01e1e446649d8fc6e89b100108)
<br>
