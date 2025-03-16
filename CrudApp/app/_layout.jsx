import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
          {/* <Stack options={{headerShown:false}}/> */}
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
    </SafeAreaProvider>
  );
}
