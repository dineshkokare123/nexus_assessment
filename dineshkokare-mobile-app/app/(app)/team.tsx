import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function TeamScreen() {
    const [team, setTeam] = useState<any[]>([]);
    const [pending, setPending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchTeam = async () => {
        try {
            const { data } = await api.get('/team');
            setTeam(data.members || []);
            setPending(data.pending_invitations || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTeam();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchTeam();
    };

    const renderMember = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <LinearGradient
                colors={['#4c669f', '#3b5998']}
                style={styles.avatar}
            >
                <Text style={styles.avatarText}>{item.name ? item.name[0].toUpperCase() : '?'}</Text>
            </LinearGradient>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.roleContainer}>
                    <Ionicons name="shield-checkmark" size={12} color="#3b5998" />
                    <Text style={styles.role}>{item.role}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.moreBtn}>
                <Ionicons name="ellipsis-vertical" size={20} color="#ccc" />
            </TouchableOpacity>
        </View>
    );

    if (loading) return <View style={styles.center}><ActivityIndicator color="#3b5998" /></View>;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#192f6a', '#3b5998']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>My Team</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/contacts')}
                        style={styles.addButton}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="person-add" size={20} color="#3b5998" />
                        <Text style={styles.addButtonText}>Invite</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{team.length}</Text>
                        <Text style={styles.statLabel}>Active</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{pending.length}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.listContainer}>
                <FlatList
                    data={team}
                    renderItem={renderMember}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b5998" />}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={
                        <Text style={styles.listHeader}>Team Members</Text>
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="people-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyText}>No team members yet.</Text>
                            <TouchableOpacity onPress={() => router.push('/contacts')}>
                                <Text style={styles.emptyAction}>Invite someone now!</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#3b5998',
        fontWeight: '700',
        marginLeft: 4,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        padding: 15,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 2,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    listContainer: {
        flex: 1,
        marginTop: -10,
        paddingHorizontal: 16,
    },
    listContent: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    listHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 16,
        marginLeft: 4,
    },
    card: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    info: {
        flex: 1,
    },
    name: {
        fontWeight: '700',
        fontSize: 16,
        color: '#2c3e50',
    },
    email: {
        color: '#7f8c8d',
        fontSize: 14,
        marginTop: 2,
    },
    roleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    role: {
        color: '#3b5998',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    moreBtn: {
        padding: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 16,
        color: '#95a5a6',
        fontSize: 16,
        marginBottom: 8,
    },
    emptyAction: {
        color: '#3b5998',
        fontWeight: '600',
        fontSize: 16,
    }
});
