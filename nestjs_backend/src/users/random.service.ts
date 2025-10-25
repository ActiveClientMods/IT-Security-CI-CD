// Vulnerability 4: Weak random number generation for security tokens
export class RandomService {
  generatePasswordResetToken(): string {
    // UNSAFE: Math.random() is not cryptographically secure
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    return token;
  }

  generateSessionId(): string {
    // UNSAFE: Predictable random generation
    return Date.now().toString() + Math.random().toString();
  }
}
