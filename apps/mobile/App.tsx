import { StatusBar } from "expo-status-bar"
import { StyleSheet, View } from "react-native"
import EditCreatorProfileScreen from "./src/screens/EditCreatorProfileScreen"

export default function App() {
  return (
    <View style={styles.container}>
      <EditCreatorProfileScreen />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
})
