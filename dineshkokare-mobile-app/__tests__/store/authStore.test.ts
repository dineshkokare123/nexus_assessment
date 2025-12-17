import { useAuthStore } from '../../store/authStore';

describe('Auth Store', () => {
    it('should initially be logged out', () => {
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
    });

    it('should set user and token on login', () => {
        const mockUser = { id: 1, name: 'Test', email: 'test@example.com', role: 'member' as const };
        const mockToken = 'abc-123';

        useAuthStore.getState().login(mockUser, mockToken);

        const state = useAuthStore.getState();
        expect(state.user).toEqual(mockUser);
        expect(state.token).toBe(mockToken);
    });

    it('should clear state on logout', () => {
        useAuthStore.getState().logout();
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
    });
});
