import { apiFetch } from "./api-client"

export interface FollowResponse {
  isFollowing: boolean
  followerCount: number
}

export async function followCreator(
  slug: string,
  token: string
): Promise<FollowResponse> {
  return apiFetch<FollowResponse>(
    `/api/creators/${encodeURIComponent(slug)}/follow`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

export async function unfollowCreator(
  slug: string,
  token: string
): Promise<FollowResponse> {
  return apiFetch<FollowResponse>(
    `/api/creators/${encodeURIComponent(slug)}/follow`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}
