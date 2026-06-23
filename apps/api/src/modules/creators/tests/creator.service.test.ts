import { beforeEach, describe, expect, it } from "vitest"
import { prisma } from "../../../shared/database/prisma.js"
import { creatorService } from "../services/creator.service.js"

async function createTestUser(email = "creator@test.com") {
  return prisma.user.create({
    data: { email, passwordHash: "irrelevant-hash" },
  })
}

describe("creatorService.createCreatorProfile", () => {
  it("creates a profile and derives the slug from the display name", async () => {
    const user = await createTestUser()

    const profile = await creatorService.createCreatorProfile({
      userId: user.id,
      displayName: "Jordan Rivers",
      bio: "Indie artist",
      genre: "Jazz",
    })

    expect(profile.userId).toBe(user.id)
    expect(profile.displayName).toBe("Jordan Rivers")
    expect(profile.slug).toBe("jordan-rivers")
    expect(profile.bio).toBe("Indie artist")
    expect(profile.isVerified).toBe(false)
  })

  it("throws 409 CREATOR_PROFILE_EXISTS when the user already has a profile", async () => {
    const user = await createTestUser()
    await creatorService.createCreatorProfile({
      userId: user.id,
      displayName: "Jordan Rivers",
    })

    await expect(
      creatorService.createCreatorProfile({
        userId: user.id,
        displayName: "Jordan Rivers Again",
      })
    ).rejects.toMatchObject({ statusCode: 409, code: "CREATOR_PROFILE_EXISTS" })
  })

  it("strips special characters from the slug", async () => {
    const user = await createTestUser()

    const profile = await creatorService.createCreatorProfile({
      userId: user.id,
      displayName: "DJ Ché & The Ø",
    })

    expect(profile.slug).toBe("dj-ch-the")
  })
})

describe("creatorService.findBySlug", () => {
  it("returns the profile for a known slug", async () => {
    const user = await createTestUser()
    await creatorService.createCreatorProfile({
      userId: user.id,
      displayName: "Solar Vibes",
    })

    const found = await creatorService.findBySlug("solar-vibes")
    expect(found).not.toBeNull()
    expect(found?.displayName).toBe("Solar Vibes")
  })

  it("returns null for an unknown slug", async () => {
    const result = await creatorService.findBySlug("does-not-exist")
    expect(result).toBeNull()
  })
})

describe("creatorService.updateCreatorProfile", () => {
  it("updates the fields provided", async () => {
    const user = await createTestUser()
    const profile = await creatorService.createCreatorProfile({
      userId: user.id,
      displayName: "Original Name",
    })

    const updated = await creatorService.updateCreatorProfile(profile.id, {
      bio: "Updated bio",
      location: "Abuja",
    })

    expect(updated.bio).toBe("Updated bio")
    expect(updated.location).toBe("Abuja")
    expect(updated.displayName).toBe("Original Name")
  })

  it("throws 404 CREATOR_NOT_FOUND for a non-existent profile id", async () => {
    await expect(
      creatorService.updateCreatorProfile("nonexistent-id", { bio: "Hello" })
    ).rejects.toMatchObject({ statusCode: 404, code: "CREATOR_NOT_FOUND" })
  })
})
