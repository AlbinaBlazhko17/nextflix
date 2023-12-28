import jwt from 'jsonwebtoken';
import { findVideoIdByUser, createNewStats, updateStats } from '@/lib/db/hasura';

export default async function stats(req, res) {
	try {
		const token = req.cookies.token;
		const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_SECRET_JWT_TOKEN);
		const userId = decodedToken.issuer;
		const { videoId } = req.method === 'POST' ? req.body : req.query;
		const findVideById = await findVideoIdByUser(token, userId, videoId);
		const isStatsExist = findVideById?.length > 0;
		if (!token) {
			res.status(403).send('Forbidden');
		}

		if (req.method === 'GET') {
			if (isStatsExist) {
				res.status(200).send({ msg: 'Get request to stats', findVideById });
			}
			res.status(404).send({ msg: 'Video not found' });
		}

		if (req.method === 'POST') {
			const { favorited, watched } = req.body;

			if (isStatsExist) {
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
