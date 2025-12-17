import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import { usePushNotifications } from '../../hooks/usePushNotifications';

export default function HomeScreen() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    usePushNotifications(); // Initialize push notifications
    const [stats, setStats] = useState({
        total_members: 0,
        pending_invites: 0,
        completion_rate: 0,
        active_members: 0
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
            setRefreshing(false);
        }
    };

    useEffect(() => {
        checkAuthAndFetchStats();
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            checkAuthAndFetchStats();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        checkAuthAndFetchStats();
    }, []);

    const handleLogout = () => {
        logout();
        router.replace('/(auth)/login');
    };

    const StatCard = ({ label, value, icon, color }: any) => (
        <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
            <View>
                <Text style={styles.statNumber}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
            </View>
            <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#192f6a', '#3b5998', '#4c669f']}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>Welcome back,</Text>
                        <Text style={styles.username}>{user?.name}</Text>
                        <View style={styles.roleContainer}>
                            <Ionicons name="shield-checkmark-outline" size={14} color="#fff" />
                            <Text style={styles.roleText}>{user?.role}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                        <Ionicons name="log-out-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b5998" />}
            >
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                </View>

                <View style={styles.statsGrid}>
                    <StatCard
                        label="Total Team"
                        value={stats.total_members}
                        icon="people"
                        color="#4c669f"
                    />
                    <StatCard
                        label="Pending Invites"
                        value={stats.pending_invites}
                        icon="mail-unread"
                        color="#f0ad4e"
                    />
                    <StatCard
                        label="Active Members"
                        value={stats.active_members || 0}
                        icon="pulse"
                        color="#5cb85c"
                    />
                    <StatCard
                        label="Completion Rate"
                        value={`${stats.completion_rate}%`}
                        icon="checkmark-circle"
                        color="#d9534f"
                    />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                </View>

                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/contacts')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#e3f2fd' }]}>
                            <Ionicons name="person-add" size={24} color="#1976d2" />
                        </View>
                        <Text style={styles.actionText}>Invite Member</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tasks/create')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#e8f5e9' }]}>
                            <Ionicons name="create" size={24} color="#388e3c" />
                        </View>
                        <Text style={styles.actionText}>New Task</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(app)/team')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#fff3e0' }]}>
                            <Ionicons name="list" size={24} color="#f57c00" />
                        </View>
                        <Text style={styles.actionText}>View Team</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 16,
        color: '#rgba(255,255,255,0.8)',
        marginBottom: 4,
    },
    username: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    roleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    roleText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
        marginLeft: 4,
        textTransform: 'capitalize',
    },
    logoutBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 50,
    },
    content: {
        flex: 1,
        marginTop: -20,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        marginTop: 25,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#34495e',
    },
    statsGrid: {
        gap: 12,
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: '#2c3e50',
    },
    statLabel: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 4,
    },
    iconBox: {
        padding: 10,
        borderRadius: 12,
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        width: '31%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 2,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2c3e50',
    }
});
