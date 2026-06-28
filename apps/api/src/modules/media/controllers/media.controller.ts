import type { NextFunction, Request, Response } from "express"
import { mediaService } from "../services/media.service.js"
import { creatorService } from "../../creators/services/creator.service.js"
import { toMediaAssetResponse } from "../types/media.types.js"
import { AppError } from "../../../shared/errors/app-error.js"

export const mediaController = {
  async requestUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!
      const { type, altText } = req.body as { type?: string; altText?: string }

      if (!type) {
        throw new AppError(400, "MISSING_TYPE", "type is required")
      }

      const result = await mediaService.requestUpload(userId, type, altText)
      res.status(201).json({
        uploadUrl: result.uploadUrl,
        mediaAsset: toMediaAssetResponse(result.mediaAsset),
      })
    } catch (error) {
      next(error)
    }
  },

  async listMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params
      const profile = await creatorService.findBySlug(slug!)
      if (!profile) {
        throw new AppError(404, "CREATOR_NOT_FOUND", "Creator profile not found")
      }

      const assets = await mediaService.listMedia(profile.id)
      res.status(200).json(assets.map(toMediaAssetResponse))
    } catch (error) {
      next(error)
    }
  },

  async updateMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!
      const { mediaId } = req.params
      const { altText, sortOrder } = req.body as { altText?: string | null; sortOrder?: number }

      const asset = await mediaService.updateMedia(mediaId!, userId, { altText, sortOrder })
      res.status(200).json(toMediaAssetResponse(asset))
    } catch (error) {
      next(error)
    }
  },

  async deleteMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!
      const { mediaId } = req.params

      await mediaService.deleteMedia(mediaId!, userId)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  },

  async reorderMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!
      const { items } = req.body as { items: { id: string; sortOrder: number }[] }

      if (!items || !Array.isArray(items)) {
        throw new AppError(400, "INVALID_INPUT", "items array is required")
      }

      await mediaService.reorderMedia(userId, items)
      res.status(200).json({ ok: true })
    } catch (error) {
      next(error)
    }
  },

  async setCover(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!
      const { mediaId } = req.params

      const asset = await mediaService.setCover(mediaId!, userId)
      res.status(200).json(toMediaAssetResponse(asset))
    } catch (error) {
      next(error)
    }
  },
}
