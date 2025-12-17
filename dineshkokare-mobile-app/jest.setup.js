import 'react-native-gesture-handler/jestSetup';

jest.mock('expo-linking', () => ({
    createURL: jest.fn(),
}));

jest.mock('expo-constants', () => ({
    manifest: {
        extra: {
            apiUrl: 'http://localhost:3000',
        },
    },
}));

// (Removed NativeAnimatedHelper mock)

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    useSearchParams: () => ({}),
}));
