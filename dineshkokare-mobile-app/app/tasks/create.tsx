import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { api } from '../../services/api';
import { useRouter, Stack } from 'expo-router';

export default function CreateTaskScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assigneeId, setAssigneeId] = useState<number | null>(null);
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        api.get('/team').then(res => setTeam(res.data.members || [])).catch(console.error);
    }, []);

    const handleCreate = async () => {
        if (!title || !assigneeId) {
            Alert.alert("Error", "Please provide a title and select a team member.");
            return;
        }
        setLoading(true);
        try {
            await api.post('/tasks', {
                title,
                description,
                assignee_id: assigneeId
            });
            Alert.alert("Success", "Task assigned!");
            router.back();
        } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Stack.Screen options={{ title: 'New Task', headerBackTitle: 'Cancel', headerShown: true }} />
            <View style={styles.formGroup}>
                <Text style={styles.label}>Task Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Call 5 leads"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Details..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Assign To</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamScroll}>
                    {team.map(member => (
                        <TouchableOpacity
                            key={member.id}
                            style={[styles.memberChip, assigneeId === member.id && styles.selectedChip]}
                            onPress={() => setAssigneeId(member.id)}
                        >
                            <Text style={[styles.memberText, assigneeId === member.id && styles.selectedMemberText]}>{member.name}</Text>
                        </TouchableOpacity>
                    ))}
                    {team.length === 0 && <Text style={styles.hint}>No team members found. Invite someone first!</Text>}
                </ScrollView>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Assign Task</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    teamScroll: {
        flexGrow: 0,
    },
    memberChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedChip: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    memberText: {
        color: '#333',
    },
    selectedMemberText: {
        color: '#fff',
        fontWeight: '600',
    },
    hint: {
        color: '#999',
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }

});
