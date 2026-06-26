import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="new-order"
          options={{
            headerShown: true,
            headerTitle: "New Order",
            headerStyle: { backgroundColor: "#1E1A16" },
            headerTintColor: "#C9A96E",
            headerTitleStyle: { fontWeight: "400", fontSize: 18 },
          }}
        />
      </Stack>
    </>
  );
}