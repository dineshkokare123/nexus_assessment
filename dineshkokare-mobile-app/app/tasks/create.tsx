import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { api } from '../../services/api';
import { useRouter, Stack } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function CreateTaskScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assigneeId, setAssigneeId] = useState<number | null>(null);
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuthStore();

    useEffect(() => {
        api.get('/team').then(res => {
            const members = res.data.members || [];
            setTeam(members);

            // If no team members, default to self-assignment or if only 1 member, select them
            if (members.length === 0 && user) {
                // Determine if we should allow self-assign as fallback?
                // The API might expect a valid user ID. 
                // Let's manually add "Myself" to the list if empty or allowed.
            }
        }).catch(console.error);
    }, []);

    const handleCreate = async () => {
        let finalAssigneeId = assigneeId;

        // If no team members and user didn't select anyone (because UI was empty),
        // we can try to assign to self IF the list was empty. 
        if (!finalAssigneeId && team.length === 0 && user) {
            Alert.alert(
                "No Team Members",
                "You don't have any team members yet. Do you want to assign this task to yourself?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Assign to Me",
                        onPress: async () => {
                            setLoading(true);
                            try {
                                await api.post('/tasks', {
                                    title,
                                    description,
                                    assignee_id: user.id
                                });
                                Alert.alert("Success", "Task created for yourself!");
                                router.back();
                            } catch (e: any) {
                                Alert.alert("Error", e.message || "Failed to create task");
                            } finally {
                                setLoading(false);
                            }
                        }
                    }
                ]
            );
            return;
        }

        if (!title || !finalAssigneeId) {
            Alert.alert("Error", "Please provide a title and select a team member.");
            return;
        }

        setLoading(true);
        try {
            await api.post('/tasks', {
                title,
                description,
                assignee_id: finalAssigneeId
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
        <View style={styles.container}>
            <StatusBar style="dark" />
            <Stack.Screen options={{
                title: 'New Task',
                headerBackTitle: 'Cancel',
                headerShown: true,
                headerStyle: { backgroundColor: '#f5f7fa' },
                headerShadowVisible: false,
            }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.card}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Task Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Follow up with lead"
                                placeholderTextColor="#999"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Add detailed instructions..."
                                placeholderTextColor="#999"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Assign To</Text>
                            {team.length > 0 ? (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamScroll}>
                                    {team.map(member => (
                                        <TouchableOpacity
                                            key={member.id}
                                            style={[styles.memberChip, assigneeId === member.id && styles.selectedChip]}
                                            onPress={() => setAssigneeId(member.id)}
                                        >
                                            <View style={[styles.avatar, assigneeId === member.id && styles.selectedAvatar]}>
                                                <Text style={[styles.avatarText, assigneeId === member.id && styles.selectedAvatarText]}>
                                                    {member.name ? member.name[0].toUpperCase() : '?'}
                                                </Text>
                                            </View>
                                            <Text style={[styles.memberText, assigneeId === member.id && styles.selectedMemberText]}>
                                                {member.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <View style={styles.emptyTeamContainer}>
                                    <Ionicons name="people-outline" size={24} color="#999" />
                                    <Text style={styles.hint}>No team members to assign.</Text>
                                    <TouchableOpacity onPress={() => router.push('/contacts')}>
                                        <Text style={styles.link}>Invite Someone</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Allow assigning to self if team exists but user wants to self-assign? Optional feature.
                                For now, relying on the map above. */}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={handleCreate}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#00d2ff', '#3a7bd5']}
                            style={styles.gradientButton}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Publish Task</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 24,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#333',
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    teamScroll: {
        flexGrow: 0,
        marginTop: 4,
    },
    memberChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 30,
        backgroundColor: '#f0f2f5',
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedChip: {
        backgroundColor: '#e3f2fd',
        borderColor: '#3a7bd5',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#d1cdc7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    selectedAvatar: {
        backgroundColor: '#3a7bd5',
    },
    avatarText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    selectedAvatarText: {
        color: '#fff',
    },
    memberText: {
        color: '#555',
        fontWeight: '600',
        fontSize: 14,
    },
    selectedMemberText: {
        color: '#3a7bd5',
    },
    emptyTeamContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    hint: {
        color: '#999',
        fontSize: 14,
        marginTop: 8,
    },
    link: {
        color: '#3a7bd5',
        fontWeight: 'bold',
        marginTop: 8,
    },
    buttonContainer: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#3a7bd5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    gradientButton: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    }
});
