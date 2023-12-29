import jwt from 'jsonwebtoken';

export async function verifyToken(token) {
	if (token) {
		try {
			const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_SECRET_JWT_TOKEN);
			return decodedToken?.issuer;
		} catch (err) {
			console.error('Something went wrong with token verification!', err);
			return {};
		}
	}
}
