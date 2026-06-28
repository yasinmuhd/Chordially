import { AppError } from "../../../shared/errors/app-error.js"
import { createAvatarUploadUrl } from "../../../shared/storage/s3.js"
import { mediaRepository } from "../repositories/media.repository.js"
import { creatorRepository } from "../../creators/repositories/creator.repository.js"
import type { MediaAsset } from "../types/media.types.js"

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"]

export const mediaService = {
  async requestUpload(
    userId: string,
    type: string,
    altText?: string | null
  ): Promise<{ uploadUrl: string; mediaAsset: MediaAsset }> {
    const profile = await creatorRepository.findByUserId(userId)
    if (!profile) {
      throw new AppError(404, "CREATOR_PROFILE_REQUIRED", "Create a creator profile first")
    }

    if (!ALLOWED_CONTENT_TYPES.includes(type)) {
      throw new AppError(
        400,
        "INVALID_CONTENT_TYPE",
        `Content type must be one of: ${ALLOWED_CONTENT_TYPES.join(", ")}`
      )
    }

    const ext = type.split("/")[1]
    const key = `media/${profile.id}/${Date.now()}.${ext}`
    const uploadUrl = await createAvatarUploadUrl(key, type)
    const url = `https://${process.env["AWS_S3_BUCKET"]}.s3.amazonaws.com/${key}`

    const count = await mediaRepository.findByCreatorId(profile.id)
    const sortOrder = count.length

    const mediaAsset = await mediaRepository.create({
      creatorId: profile.id,
      type,
      url,
      altText: altText ?? null,
      sortOrder,
    })

    return { uploadUrl, mediaAsset }
  },

  async listMedia(creatorId: string): Promise<MediaAsset[]> {
    return mediaRepository.findByCreatorId(creatorId)
  },

  async updateMedia(
    mediaId: string,
    userId: string,
    data: { altText?: string | null; sortOrder?: number }
  ): Promise<MediaAsset> {
    const asset = await mediaRepository.findById(mediaId)
    if (!asset) {
      throw new AppError(404, "MEDIA_NOT_FOUND", "Media asset not found")
    }

    const profile = await creatorRepository.findById(asset.creatorId)
    if (!profile || profile.userId !== userId) {
      throw new AppError(403, "FORBIDDEN", "You do not have permission to update this asset")
    }

    return mediaRepository.update(mediaId, data)
  },

  async deleteMedia(mediaId: string, userId: string): Promise<void> {
    const asset = await mediaRepository.findById(mediaId)
    if (!asset) {
      throw new AppError(404, "MEDIA_NOT_FOUND", "Media asset not found")
    }

    const profile = await creatorRepository.findById(asset.creatorId)
    if (!profile || profile.userId !== userId) {
      throw new AppError(403, "FORBIDDEN", "You do not have permission to delete this asset")
    }

    await mediaRepository.delete(mediaId)
  },

  async reorderMedia(
    userId: string,
    items: { id: string; sortOrder: number }[]
  ): Promise<void> {
    const profile = await creatorRepository.findByUserId(userId)
    if (!profile) {
      throw new AppError(404, "CREATOR_PROFILE_REQUIRED", "Create a creator profile first")
    }

    for (const item of items) {
      const asset = await mediaRepository.findById(item.id)
      if (!asset || asset.creatorId !== profile.id) {
        throw new AppError(404, "MEDIA_NOT_FOUND", `Media asset ${item.id} not found`)
      }
      await mediaRepository.updateSortOrder(item.id, item.sortOrder)
    }
  },

  async setCover(mediaId: string, userId: string): Promise<MediaAsset> {
    const asset = await mediaRepository.findById(mediaId)
    if (!asset) {
      throw new AppError(404, "MEDIA_NOT_FOUND", "Media asset not found")
    }

    const profile = await creatorRepository.findById(asset.creatorId)
    if (!profile || profile.userId !== userId) {
      throw new AppError(403, "FORBIDDEN", "You do not have permission to set cover")
    }

    await mediaRepository.setCover(asset.creatorId, mediaId)
    return mediaRepository.findById(mediaId) as Promise<MediaAsset>
  },
}
