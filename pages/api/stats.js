import jwt from 'jsonwebtoken';
import { findVideoIdByUser, createNewStats, updateStats } from '@/lib/db/hasura';

export default async function stats(req, res) {
	if (req.method === 'POST') {
		try {
			const token = req.cookies.token;
			if (!token) {
				res.status(403).send('Forbidden');
			} else {
				const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_SECRET_JWT_TOKEN);
				const userId = decodedToken.issuer;
				const { videoId, favorited, watched = true } = req.body;
				const findVideById = await findVideoIdByUser(token, userId, videoId);
				if (findVideById) {
					const updatedStats = await updateStats(token, {
						favorited,
						watched,
						userId,
						videoId,
					});
					res.status(200).send({
						msg: 'Post request to stats',
						updatedStats,
					});
				} else {
					const newStats = await createNewStats(token, {
						favorited: 0,
						watched: false,
						videoId,
						userId: userId,
					});
					res.status(200).send({ msg: 'Post request to stats', newStats });
				}
			}
		} catch (err) {
			res.status(500).send('Error! ' + err);
		}
	}
}
