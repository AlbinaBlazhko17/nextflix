import { jwtVerify } from 'jose';

export async function verifyToken(token) {
	try {
		if (token) {
			const decodedToken = await jwtVerify(
				token,
				new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_JWT_TOKEN),
			);

			const userId = decodedToken.payload && decodedToken.payload?.issuer;

			return userId;
		}

		return null;
	} catch (error) {
		return null;
	}
}
