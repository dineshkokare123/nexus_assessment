import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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

    useEffect(() => {
        fetchTeam();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTeam();
    };

    const renderMember = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name ? item.name[0] : '?'}</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <Text style={styles.role}>{item.role}</Text>
            </View>
        </View>
    );

    if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

    return (
        <View style={styles.container}>
            <FlatList
                data={team}
                renderItem={renderMember}
                keyExtractor={item => item.id.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.subtitle}>My Recruits ({team.length})</Text>
                        <TouchableOpacity onPress={() => router.push('/contacts')}>
                            <Ionicons name="person-add" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                }
                ListEmptyComponent={<Text style={styles.emptyText}>No team members yet. Tap + to invite!</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    subtitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    card: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#007AFF',
        fontWeight: '700',
    },
    info: {
        flex: 1,
    },
    name: {
        fontWeight: '600',
        fontSize: 16,
        color: '#333',
    },
    email: {
        color: '#666',
        fontSize: 14,
    },
    role: {
        color: '#999',
        fontSize: 12,
        marginTop: 2,
        textTransform: 'uppercase',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#888',
        fontSize: 16,
    }
});
