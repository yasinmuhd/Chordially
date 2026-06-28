import { prisma } from "../../../shared/database/prisma.js"
import type { MediaAsset } from "../types/media.types.js"

export const mediaRepository = {
  async findById(id: string): Promise<MediaAsset | null> {
    return prisma.mediaAsset.findUnique({ where: { id } }) as unknown as MediaAsset | null
  },

  async findByCreatorId(creatorId: string): Promise<MediaAsset[]> {
    return prisma.mediaAsset.findMany({
      where: { creatorId },
      orderBy: { sortOrder: "asc" },
    }) as unknown as MediaAsset[]
  },

  async findCoverByCreatorId(creatorId: string): Promise<MediaAsset | null> {
    return prisma.mediaAsset.findFirst({
      where: { creatorId, isCover: true },
    }) as unknown as MediaAsset | null
  },

  async create(data: {
    creatorId: string
    type: string
    url: string
    altText?: string | null
    width?: number | null
    height?: number | null
    sortOrder?: number
  }): Promise<MediaAsset> {
    return prisma.mediaAsset.create({ data }) as unknown as MediaAsset
  },

  async update(
    id: string,
    data: { altText?: string | null; sortOrder?: number }
  ): Promise<MediaAsset> {
    return prisma.mediaAsset.update({ where: { id }, data }) as unknown as MediaAsset
  },

  async delete(id: string): Promise<void> {
    await prisma.mediaAsset.delete({ where: { id } })
  },

  async updateSortOrder(
    id: string,
    sortOrder: number
  ): Promise<MediaAsset> {
    return prisma.mediaAsset.update({
      where: { id },
      data: { sortOrder },
    }) as unknown as MediaAsset
  },

  async setCover(creatorId: string, mediaId: string): Promise<void> {
    await prisma.$transaction([
      prisma.mediaAsset.updateMany({
        where: { creatorId },
        data: { isCover: false },
      }),
      prisma.mediaAsset.update({
        where: { id: mediaId },
        data: { isCover: true },
      }),
    ])
  },
}
