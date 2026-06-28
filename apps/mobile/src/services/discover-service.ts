import { apiFetch } from "./api-client"

export interface DiscoverParams {
  page?: number
  limit?: number
  genre?: string | null
  location?: string | null
  sort?: string | null
}

export interface DiscoveredCreator {
  id: string
  slug: string
  displayName: string
  avatarUrl: string | null
  genre: string | null
  location: string | null
  isVerified: boolean
  followerCount: number
}

export interface DiscoverResponse {
  creators: DiscoveredCreator[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export function discoverCreators(
  params: DiscoverParams
): Promise<DiscoverResponse> {
  const query = new URLSearchParams()
  if (params.page != null) query.set("page", String(params.page))
  if (params.limit != null) query.set("limit", String(params.limit))
  if (params.genre) query.set("genre", params.genre)
  if (params.location) query.set("location", params.location)
  if (params.sort) query.set("sort", params.sort)

  const qs = query.toString()
  return apiFetch<DiscoverResponse>(`/api/discover${qs ? `?${qs}` : ""}`)
}
