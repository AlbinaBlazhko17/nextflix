import { verifyToken } from '@/lib/utils';

export async function redirectUser(token) {
	const userId = await verifyToken(token);
	return userId;
}
