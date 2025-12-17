import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, Linking, Platform, SafeAreaView } from 'react-native';
import * as Contacts from 'expo-contacts';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

export default function ContactsScreen() {
    const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contacts.Contact[]>([]);
    const [search, setSearch] = useState('');
    const [permissionGranted, setPermissionGranted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                setPermissionGranted(true);
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
                });
                if (data.length > 0) {
                    const validContacts = data.filter(c => c.phoneNumbers && c.phoneNumbers.length > 0 && c.name);
                    setContacts(validContacts);
                    setFilteredContacts(validContacts);
                }
            } else {
                Alert.alert("Permission Required", "Please enable contact permissions to invite team members.");
            }
        })();
    }, []);

    const handleSearch = (text: string) => {
        setSearch(text);
        if (text) {
            const filtered = contacts.filter(c =>
                c.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredContacts(filtered);
        } else {
            setFilteredContacts(contacts);
        }
    };

    const handleInvite = async (contact: Contacts.Contact) => {
        const phone = contact.phoneNumbers?.[0]?.number;
        const name = contact.name;
        if (!phone) return;

        try {
            await api.post('/invitations', { phone, name });

            const message = `Hey ${name}, join my sales team on NaxumApp! Download here: https://naxum.app/join`;
            const url = Platform.OS === 'android' ? `sms:${phone}?body=${message}` : `sms:${phone}&body=${message}`;

            await Linking.openURL(url);
            Alert.alert("Success", "Invitation tracked and SMS opened.");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not track invitation, but you can still send SMS.");
            // Fallback to just SMS
            const message = `Hey ${name}, join my sales team on NaxumApp! Download here: https://naxum.app/join`;
            const url = Platform.OS === 'android' ? `sms:${phone}?body=${message}` : `sms:${phone}&body=${message}`;
            await Linking.openURL(url);
        }
    };

    const renderItem = ({ item }: { item: Contacts.Contact }) => (
        <View style={styles.contactItem}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name?.[0] || '?'}</Text>
            </View>
            <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactPhone}>{item.phoneNumbers?.[0]?.number}</Text>
            </View>
            <TouchableOpacity style={styles.inviteButton} onPress={() => handleInvite(item)}>
                <Text style={styles.inviteText}>Invite</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Contacts', headerBackTitle: 'Home', headerShown: true }} />
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search contacts..."
                    value={search}
                    onChangeText={handleSearch}
                />
            </View>

            {!permissionGranted ? (
                <View style={styles.center}>
                    <Text>Waiting for permissions...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredContacts}
                    renderItem={renderItem}
                    keyExtractor={(item) => (item as any).id || item.name || Math.random().toString()}
                    contentContainerStyle={styles.listContent}
                />
            )}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        margin: 16,
        paddingHorizontal: 12,
        borderRadius: 10,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    listContent: {
        paddingHorizontal: 16,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
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
        fontWeight: 'bold',
        fontSize: 18,
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    contactPhone: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    inviteButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    inviteText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
