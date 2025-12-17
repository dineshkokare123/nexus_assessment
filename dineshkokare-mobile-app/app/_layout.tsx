import { Stack, Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
    const { isAuthenticated } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to login if accessing protected route
            router.replace("/(auth)/login");
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect to home if accessing login while authenticated
            router.replace("/(app)/home");
        }
    }, [isAuthenticated, segments, isMounted]);

    if (!isMounted) {
        return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
    }

    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(app)" />
            </Stack>
            <StatusBar style="dark" />
        </SafeAreaProvider>
    );
}
