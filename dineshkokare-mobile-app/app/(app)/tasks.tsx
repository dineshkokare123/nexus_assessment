import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Alert, Platform } from 'react-native';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { Task } from '../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function TasksScreen() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'my_tasks' | 'assigned_by_me'>('my_tasks');
    const router = useRouter();

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks', { params: { filter } });
            setTasks(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [filter])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchTasks();
    };

    const handleToggleStatus = async (task: Task) => {
        try {
            const newStatus = task.status === 'pending' ? 'completed' : 'pending';
            await api.patch(`/tasks/${task.id}`, { status: newStatus });
            // Optimistic update
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
        } catch (e) {
            Alert.alert("Error", "Could not update task");
        }
    };

    const renderItem = ({ item }: { item: Task }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => handleToggleStatus(item)} style={styles.checkboxContainer}>
                <Ionicons
                    name={item.status === 'completed' ? "checkbox" : "square-outline"}
                    size={28}
                    color={item.status === 'completed' ? "#5cb85c" : "#999"}
                />
            </TouchableOpacity>
            <View style={styles.content}>
                <Text style={[styles.title, item.status === 'completed' && styles.completedTitle]}>
                    {item.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                <View style={styles.meta}>
                    <Ionicons name="person-circle-outline" size={14} color="#999" />
                    <Text style={styles.metaText}>
                        {filter === 'my_tasks' ? `From: ${item.assigner?.name || 'Unknown'}` : `To: ${item.assignee?.name || 'Unknown'}`}
                    </Text>
                </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? '#dff0d8' : '#fcf8e3' }]}>
                <Text style={[styles.statusText, { color: item.status === 'completed' ? '#3c763d' : '#8a6d3b' }]}>
                    {item.status}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#192f6a', '#3b5998']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Task Management</Text>
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, filter === 'my_tasks' && styles.activeTab]}
                        onPress={() => setFilter('my_tasks')}
                    >
                        <Text style={[styles.tabText, filter === 'my_tasks' && styles.activeTabText]}>My Tasks</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, filter === 'assigned_by_me' && styles.activeTab]}
                        onPress={() => setFilter('assigned_by_me')}
                    >
                        <Text style={[styles.tabText, filter === 'assigned_by_me' && styles.activeTabText]}>Assigned</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b5998" />}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="checkbox-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No tasks found.</Text>
                    </View>
                }
            />

            <TouchableOpacity style={styles.fab} onPress={() => router.push('/tasks/create')} activeOpacity={0.8}>
                <LinearGradient
                    colors={['#00d2ff', '#3a7bd5']}
                    style={styles.fabGradient}
                >
                    <Ionicons name="add" size={32} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
    },
    activeTabText: {
        color: '#3b5998',
    },
    list: {
        padding: 16,
        paddingBottom: 100,
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
    checkboxContainer: {
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2c3e50',
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: '#bdc3c7',
    },
    description: {
        color: '#7f8c8d',
        fontSize: 14,
        marginTop: 4,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    metaText: {
        fontSize: 12,
        color: '#95a5a6',
        marginLeft: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
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
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        borderRadius: 30,
        shadowColor: '#3a7bd5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    fabGradient: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
