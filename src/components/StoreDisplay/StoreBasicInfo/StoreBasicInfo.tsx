import React, { useMemo } from 'react'
import KeywordBadge from '@components/styles/KeywordBadge'
import { getBrandImg } from '@services/markerImg'
import funlogImg from '../../../assets/convImg/funlog.png'
import { PhoneFilled, PushpinFilled, StarFilled } from '@ant-design/icons'
import {
  ConvImgWrapper,
  InfoContainer,
  ConvInfo,
  KeywordBox,
  StarPoint,
} from './StoreBasicInfo.styles'

interface StoreBasicInfoProps {
  placeName: string
  addressName: string
  phone: string
  keywordList: string[]
  starCount: number
}

const StoreBasicInfo: React.FC<StoreBasicInfoProps> = ({
  placeName,
  addressName,
  phone,
  keywordList,
  starCount,
}) => {
  const storeImg = useMemo(
    () => getBrandImg(placeName.split(' ', 1)[0]) ?? funlogImg,
    [placeName]
  )

  return (
    <InfoContainer>
      <ConvImgWrapper>
        <img src={storeImg} />
      </ConvImgWrapper>

      <ConvInfo>
        <h1>{placeName}</h1>
        <p>
          <span>
            <PushpinFilled />
            {addressName}
          </span>
          <span>
            <PhoneFilled />
            {phone && phone.length > 0 ? phone : '전화번호가 없습니다.'}
          </span>
        </p>
        <KeywordBox>
          <ul>
            {keywordList.slice(0, 5).map((keyword) => (
              <KeywordBadge key={keyword}>{keyword}</KeywordBadge>
            ))}
          </ul>
        </KeywordBox>
      </ConvInfo>
      <StarPoint>
        <StarFilled />
        <p>{starCount}/ 5</p>
      </StarPoint>
    </InfoContainer>
  )
}

export default StoreBasicInfo
