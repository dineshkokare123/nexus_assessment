import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function AppLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            headerShown: true,
            tabBarStyle: Platform.OS === 'ios' ? { height: 88, paddingTop: 8 } : { height: 60, paddingBottom: 8 },
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="team"
                options={{
                    title: 'Team',
                    tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    title: 'Tasks',
                    tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
