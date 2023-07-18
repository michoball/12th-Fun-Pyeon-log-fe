import React from 'react'
import { createPortal } from 'react-dom'
import Overlay from '@components/Overlay/Overlay'
import { RootState, useAppSelector } from '@stores/store'

const Tooltip = () => {
  const clickedStore = useAppSelector(
    (state: RootState) => state.conv.clickedStore
  )

  const modalRoot = document.getElementById(`kakao-overlay`)

  if (!modalRoot || !clickedStore) {
    return null
  }

  return createPortal(
    <Overlay
      placeName={clickedStore.placeName}
      storeId={clickedStore.storeId}
      address={clickedStore.address}
      phoneNumber={clickedStore.phoneNumber}
      reviewCount={clickedStore.reviewCount}
      starCount={clickedStore.starCount}
    />,
    modalRoot
  )
}

export default Tooltip
