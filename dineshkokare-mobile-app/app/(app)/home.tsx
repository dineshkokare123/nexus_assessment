import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';

export default function HomeScreen() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [stats, setStats] = useState({
        total_members: 0,
        pending_invites: 0,
        completion_rate: 0,
        active_members: 0
    });
    const [loading, setLoading] = useState(true);

    const checkAuthAndFetchStats = async () => {
        if (!user) {
            router.replace('/(auth)/login');
            return;
        }

        try {
            const { data } = await api.get('/team/stats');
            if (data && data.stats) {
                setStats(data.stats);
            }
        } catch (error) {
            console.log("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthAndFetchStats();
    }, [user]);

    // Re-fetch when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            checkAuthAndFetchStats();
        }, [])
    );

    const handleLogout = () => {
        logout();
        router.replace('/(auth)/login');
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator /></View>;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.username}>{user?.name}</Text>
                    <Text style={styles.roleBadge}>{user?.role}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Ionicons name="log-out-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.total_members}</Text>
                    <Text style={styles.statLabel}>Team Members</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>0</Text>
                    <Text style={styles.statLabel}>Pending Tasks</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    roleBadge: {
        fontSize: 14,
        color: '#666',
        backgroundColor: '#f0f0f0',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
        textTransform: 'uppercase',
    },
    logoutBtn: {
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
    },
    role: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
        textTransform: 'capitalize',
    },
    profileBtn: {
        padding: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    statsContainer: {
        marginTop: 10,
    },
    statCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 10,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 16,
        color: '#555',
    }
});
