import { removeTokenCookie } from '@/lib/cookies';
import { mAdmin } from '@/lib/magic';
import { verifyToken } from '@/lib/utils';

const handler = async (req, res) => {
	if (req.method === 'POST') {
		try {
			const headers = req.headers;
			const didToken = headers && headers.authorization.split(' ')[1];

			if (!req.cookies.token)
				return res.status(401).json({ message: 'User is not logged in' });

			const token = req.cookies.token;

			try {
				const userId = verifyToken(token);
				if (userId) {
					removeTokenCookie(res);
				}
				await mAdmin.users.logoutByToken(didToken);
			} catch (error) {
				console.log("User's session with Magic already expired");
				console.error('Error occurred while logging out magic user', error);
			}
			res.writeHead(302, { Location: '/login' });
			res.end();
		} catch (error) {
			res.status(500).json({ message: error });
		}
	}
};

export default handler;
