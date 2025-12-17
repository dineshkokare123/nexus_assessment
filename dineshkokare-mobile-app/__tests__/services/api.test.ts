import { api, authApi } from '../../services/api';

jest.mock('axios', () => {
    return {
        create: jest.fn(() => ({
            interceptors: {
                request: { use: jest.fn() },
                response: { use: jest.fn() }
            },
            get: jest.fn(),
            post: jest.fn()
        }))
    };
});

describe('API Service', () => {
    it('should create axios instances', () => {
        expect(api).toBeDefined();
        expect(authApi).toBeDefined();
    });
});
