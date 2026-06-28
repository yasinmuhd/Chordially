import { useMemo, useState } from "react"
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import ProfileMediaPicker from "../components/ProfileMediaPicker"
import CreatorPublicProfilePreviewScreen, {
  type CreatorProfilePreviewData,
} from "./CreatorPublicProfilePreviewScreen"

interface SocialLinksState {
  website: string
  instagram: string
  x: string
}

interface ProfileEditorState {
  bio: string
  location: string
  socialLinks: SocialLinksState
  avatarUrl: string | null
  bannerUrl: string | null
}

const INITIAL_STATE: ProfileEditorState = {
  bio: "Indie producer creating warm, atmospheric sets.",
  location: "Lagos, Nigeria",
  socialLinks: {
    website: "https://chordially.app",
    instagram: "https://instagram.com/solarvibes",
    x: "https://x.com/solarvibes",
  },
  avatarUrl: null,
  bannerUrl: null,
}

export default function EditCreatorProfileScreen() {
  const [draft, setDraft] = useState(INITIAL_STATE)
  const [showPreview, setShowPreview] = useState(false)

  const previewProfile = useMemo<CreatorProfilePreviewData>(() => ({
    displayName: "Solar Vibes",
    handle: "@solarvibes",
    headline: "Producer • Indie • Afrobeats",
    bio: draft.bio,
    location: draft.location,
    avatarUrl: draft.avatarUrl,
    bannerUrl: draft.bannerUrl,
    socialLinks: draft.socialLinks,
    isVerified: true,
  }), [draft.avatarUrl, draft.bannerUrl, draft.bio, draft.location, draft.socialLinks])

  function updateBio(value: string) {
    setDraft((current) => ({ ...current, bio: value }))
  }

  function updateLocation(value: string) {
    setDraft((current) => ({ ...current, location: value }))
  }

  function updateAvatarUrl(value: string | null) {
    setDraft((current) => ({ ...current, avatarUrl: value }))
  }

  function updateBannerUrl(value: string | null) {
    setDraft((current) => ({ ...current, bannerUrl: value }))
  }

  function updateSocialLink(field: keyof SocialLinksState, value: string) {
    setDraft((current) => ({
      ...current,
      socialLinks: { ...current.socialLinks, [field]: value },
    }))
  }

  function handleAvatarPicked(uri: string) {
    updateAvatarUrl(uri)
  }

  function handleBannerPicked(uri: string) {
    updateBannerUrl(uri)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile editor</Text>
      <Text style={styles.description}>
        Preview your creator identity before uploading new media.
      </Text>

      <ProfileMediaPicker
        label="Avatar"
        hint="Choose a profile photo that best represents your brand"
        currentUrl={draft.avatarUrl}
        previewUrl={draft.avatarUrl}
        onImagePicked={handleAvatarPicked}
      />

      <ProfileMediaPicker
        label="Banner"
        hint="Add a banner that will appear at the top of your public profile"
        currentUrl={draft.bannerUrl}
        previewUrl={draft.bannerUrl}
        variant="banner"
        onImagePicked={handleBannerPicked}
      />

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.input}
          value={draft.bio}
          onChangeText={updateBio}
          multiline
          placeholder="Tell your audience who you are"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={draft.location}
          onChangeText={updateLocation}
          placeholder="City, Country"
        />

        <Text style={styles.sectionTitle}>Social links</Text>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={draft.socialLinks.website}
          onChangeText={(value) => updateSocialLink("website", value)}
          placeholder="https://your-site.com"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Instagram</Text>
        <TextInput
          style={styles.input}
          value={draft.socialLinks.instagram}
          onChangeText={(value) => updateSocialLink("instagram", value)}
          placeholder="https://instagram.com/your-handle"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>X / Twitter</Text>
        <TextInput
          style={styles.input}
          value={draft.socialLinks.x}
          onChangeText={(value) => updateSocialLink("x", value)}
          placeholder="https://x.com/your-handle"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Pressable
        style={styles.previewButton}
        onPress={() => setShowPreview((current) => !current)}
      >
        <Text style={styles.previewButtonText}>
          {showPreview ? "Hide public preview" : "Preview public profile"}
        </Text>
      </Pressable>

      {showPreview && (
        <View style={styles.previewCard}>
          <Text style={styles.previewCardTitle}>Public preview</Text>
          <CreatorPublicProfilePreviewScreen profile={previewProfile} />
          <Pressable
            style={styles.linkButton}
            onPress={() => {
              const firstLink = Object.values(draft.socialLinks).find(Boolean)
              if (firstLink) {
                Linking.openURL(firstLink)
              }
            }}
          >
            <Text style={styles.linkButtonText}>Open first social link</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    color: "#111827",
    backgroundColor: "#f9fafb",
  },
  previewButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 18,
    alignItems: "center",
  },
  previewButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  previewCard: {
    marginTop: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  linkButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  linkButtonText: {
    color: "#2563eb",
    fontWeight: "600",
  },
})
