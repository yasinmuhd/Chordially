import { Router } from "express"
import { requireAuth } from "../../../shared/middleware/auth.middleware.js"
import { mediaController } from "../controllers/media.controller.js"

export const mediaRouter: Router = Router()

mediaRouter.post("/me/media", requireAuth, mediaController.requestUpload)
mediaRouter.get("/:slug/media", mediaController.listMedia)
mediaRouter.patch("/me/media/reorder", requireAuth, mediaController.reorderMedia)
mediaRouter.patch("/me/media/:mediaId/cover", requireAuth, mediaController.setCover)
mediaRouter.patch("/me/media/:mediaId", requireAuth, mediaController.updateMedia)
mediaRouter.delete("/me/media/:mediaId", requireAuth, mediaController.deleteMedia)
