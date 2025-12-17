import { isValidEmail, isValidPassword, formatPhoneNumber } from './validation';

describe('Backend Validation Utils', () => {
    describe('isValidEmail', () => {
        it('should return true for valid emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
        });

        it('should return false for invalid emails', () => {
            expect(isValidEmail('invalid-email')).toBe(false);
        });
    });

    describe('isValidPassword', () => {
        it('should return true for passwords with 6 or more characters', () => {
            expect(isValidPassword('123456')).toBe(true);
            expect(isValidPassword('password')).toBe(true);
        });

        it('should return false for short passwords', () => {
            expect(isValidPassword('12345')).toBe(false);
        });
    });

    describe('formatPhoneNumber', () => {
        it('should remove non-digit characters', () => {
            expect(formatPhoneNumber('(555) 123-4567')).toBe('5551234567');
        });
    });
});
