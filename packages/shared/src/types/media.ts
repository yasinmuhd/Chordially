export interface MediaAssetResponse {
  id: string
  creatorId: string
  type: string
  url: string
  altText: string | null
  width: number | null
  height: number | null
  isCover: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}
