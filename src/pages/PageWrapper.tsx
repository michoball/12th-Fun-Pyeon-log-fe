import React, { useEffect, useState } from 'react'

interface PageWrapperProps {
  children: React.ReactNode
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const [kakaos, setKakaos] = useState<typeof kakao | null>(null)
  useEffect(() => {
    if ('kakao' in window) {
      setKakaos(window.kakao)
    }
  }, [])

  if (kakaos === null) {
    return <></>
  }

  return <div>{children}</div>
}

export default PageWrapper
