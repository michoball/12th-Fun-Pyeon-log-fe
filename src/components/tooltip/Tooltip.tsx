import React from 'react'
import { createPortal } from 'react-dom'
import Overlay from '@components/Overlay/Overlay'
import { clickedStoreSelect } from '@stores/conv/convSlice'
import { useAppSelector } from '@stores/store'

const Tooltip = () => {
  const clickedStore = useAppSelector(clickedStoreSelect)

  const modalRoot = document.getElementById(`kakao-overlay`)

  if (!modalRoot || !clickedStore) {
    return null
  }

  return createPortal(
    <Overlay
      placeName={clickedStore.place_name}
      storeId={clickedStore.storeId}
      address={clickedStore.address_name}
      phoneNumber={clickedStore.phone}
      reviewCount={clickedStore.reviewCount}
      starCount={clickedStore.starCount}
    />,
    modalRoot
  )
}

export default Tooltip
