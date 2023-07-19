import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getBrandImg } from '@services/markerImg'
import URLUtill from '@utils/urlUtill'
import funlogImg from '../../assets/convImg/funlog.png'
import phone from '../../assets/phone.png'
import pin from '../../assets/pin.png'
import star from '../../assets/star.png'
import {
  OverlayContainer,
  StarReviewContainer,
  StoreInfo,
  DetailView,
} from './Overlay.styles'

interface OverlayProps {
  placeName: string
  storeId: string
  address: string
  phoneNumber: string
  reviewCount: number
  starCount: number
}

const Overlay: React.FC<OverlayProps> = ({
  placeName,
  storeId,
  address,
  phoneNumber,
  reviewCount,
  starCount,
}) => {
  const navigate = useNavigate()
  const storeUrl = URLUtill.getStoreUrl(storeId, address)
  const [storeBrand] = placeName.split(' ', 1)
  const brandimg = getBrandImg(storeBrand)

  return (
    <OverlayContainer>
      <header>
        <img src={brandimg ?? funlogImg} alt="brand logo" />
        <h2>{placeName}</h2>
      </header>
      <StarReviewContainer>
        <div className="star">
          <img src={star} alt="star image" />
          {starCount}
        </div>
        <div className="review-count">리뷰 {reviewCount}개</div>
      </StarReviewContainer>
      <StoreInfo>
        <div className="address">
          <img src={pin} alt="pin image" />
          <p>{address}</p>
        </div>
        <div className="phone">
          <img src={phone} alt="phone image" />
          <p>{phoneNumber.length > 0 ? phoneNumber : '전화번호가 없습니다.'}</p>
        </div>
      </StoreInfo>
      <DetailView>
        <div className="link" onClick={() => navigate(storeUrl)}>
          상세보기
        </div>
      </DetailView>
    </OverlayContainer>
  )
}

export default Overlay
