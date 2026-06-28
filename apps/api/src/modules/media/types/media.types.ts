export interface MediaAsset {
  id: string
  creatorId: string
  type: string
  url: string
  altText: string | null
  width: number | null
  height: number | null
  isCover: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

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

export function toMediaAssetResponse(asset: MediaAsset): MediaAssetResponse {
  return {
    id: asset.id,
    creatorId: asset.creatorId,
    type: asset.type,
    url: asset.url,
    altText: asset.altText,
    width: asset.width,
    height: asset.height,
    isCover: asset.isCover,
    sortOrder: asset.sortOrder,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
  }
}
