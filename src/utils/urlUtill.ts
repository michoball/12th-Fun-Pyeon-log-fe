const getReviewEditUrl = (reviewId: number) => `edit/${reviewId}`

const getReviewWriteUrl = (storeId: string) => `/stores/${storeId}/write`

const getStoreUrl = (storeId: string, address: string) => {
  const addressEncode = encodeURIComponent(address)
  return `/stores/${storeId}?address=${addressEncode}`
}

const URLUtill = {
  getReviewEditUrl,
  getReviewWriteUrl,
  getStoreUrl,
}

export default URLUtill
