import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { Task } from '../../types';

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
            <TouchableOpacity onPress={() => handleToggleStatus(item)}>
                <Ionicons
                    name={item.status === 'completed' ? "checkbox" : "square-outline"}
                    size={24}
                    color={item.status === 'completed' ? "#4CAF50" : "#666"}
                />
            </TouchableOpacity>
            <View style={styles.content}>
                <Text style={[styles.title, item.status === 'completed' && styles.completedTitle]}>
                    {item.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                <View style={styles.meta}>
                    <Text style={styles.metaText}>
                        {filter === 'my_tasks' ? `From: ${item.assigner?.name || 'Unknown'}` : `To: ${item.assignee?.name || 'Unknown'}`}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
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
                    <Text style={[styles.tabText, filter === 'assigned_by_me' && styles.activeTabText]}>Assigned by Me</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No tasks found.</Text>}
            />

            <TouchableOpacity style={styles.fab} onPress={() => router.push('/tasks/create')}>
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabs: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        marginRight: 20,
        paddingBottom: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#007AFF',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    list: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    description: {
        color: '#666',
        fontSize: 14,
        marginTop: 4,
    },
    meta: {
        marginTop: 6,
    },
    metaText: {
        fontSize: 12,
        color: '#999',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#888',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    }
});
