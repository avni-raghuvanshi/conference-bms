import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET ?? 'fallback-dev-secret-change-in-production',
);

export interface OtpJwtPayload {
    email: string;
    verified: true;
}

// Token is valid for 15 minutes — enough to complete the booking form submission
export async function signOtpToken(email: string): Promise<string> {
    return new SignJWT({ email, verified: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m')
        .sign(secret);
}

export async function verifyOtpToken(token: string): Promise<OtpJwtPayload> {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.email || payload.verified !== true) {
        throw new Error('Invalid OTP token payload');
    }
    return payload as unknown as OtpJwtPayload;
}
