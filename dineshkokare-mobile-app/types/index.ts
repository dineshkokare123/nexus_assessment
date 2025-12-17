export interface User {
    id: number;
    name: string;
    email: string;
    role: 'leader' | 'member';
    inviter_id?: number | null;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'completed';
    assignee_id: number;
    assigner_id: number;
    createdAt: string;
    updatedAt: string;
    assignee?: User;
    assigner?: User;
}

export interface Invitation {
    id: number;
    phone_number: string;
    name: string;
    status: 'pending' | 'accepted' | 'declined';
    inviter_id: number;
}

export interface AuthResponse {
    user: User;
    token: string;
}
