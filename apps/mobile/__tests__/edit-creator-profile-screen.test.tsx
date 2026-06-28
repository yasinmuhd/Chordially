import { fireEvent, render, screen } from "@testing-library/react-native"
import EditCreatorProfileScreen from "../src/screens/EditCreatorProfileScreen"

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: "file:///avatar.jpg", mimeType: "image/jpeg" }],
  }),
}))

describe("EditCreatorProfileScreen", () => {
  it("renders the editing form and toggles the public preview", () => {
    render(<EditCreatorProfileScreen />)

    expect(screen.getByText("Profile editor")).toBeTruthy()
    expect(screen.getByText("Bio")).toBeTruthy()
    expect(screen.getByText("Location")).toBeTruthy()

    fireEvent.press(screen.getByText("Preview public profile"))

    expect(screen.getByText("Public preview")).toBeTruthy()
    expect(screen.getByText("Solar Vibes")).toBeTruthy()
  })
})
