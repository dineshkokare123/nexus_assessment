import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function AppLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#3b5998',
            tabBarInactiveTintColor: '#9da3b4',
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 0,
                elevation: 0,
                shadowOpacity: 0.1,
                shadowRadius: 20,
                height: Platform.OS === 'ios' ? 88 : 60,
                paddingBottom: Platform.OS === 'ios' ? 28 : 8,
                paddingTop: 8,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
            }
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
