import { isNewUser, createNewUser } from '@/lib/db/hasura';
import { mAdmin } from '@/lib/magic';
import jwt from 'jsonwebtoken';
import { setTokenCookie } from '@/lib/cookies';

export default async function login(req, res) {
	if (req.method === 'POST') {
		try {
			const auth = req.headers.authorization;
			const didToken = auth ? auth.substr(7) : null;
			const metadata = await mAdmin.users.getMetadataByToken(didToken);
			const token = jwt.sign(
				{
					...metadata,
					iat: Math.floor(Date.now() / 1000),
					exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
					'https://hasura.io/jwt/claims': {
						'x-hasura-default-role': 'user',
						'x-hasura-allowed-roles': ['user', 'admin'],
						'x-hasura-allowed-role': 'user',
						'x-hasura-user-id': `${metadata.issuer}`,
					},
				},
				process.env.NEXT_PUBLIC_SECRET_JWT_TOKEN,
			);
			const isNewUserQuery = await isNewUser(token, metadata.issuer);
			isNewUserQuery &&
				(await createNewUser(
					token,
					metadata.issuer,
					metadata.email,
					metadata.publicAddress,
				));
			setTokenCookie(token, res);
			res.status(200).send({ done: true });
		} catch (err) {
			console.error(err);
			res.status(500).send(err);
		}
	} else {
		res.status(405).send('Method Not Allowed');
	}
}
