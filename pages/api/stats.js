import { verifyToken } from '@/lib/utils';
import { findVideoIdByUser, createNewStats, updateStats } from '@/lib/db/hasura';

export default async function stats(req, res) {
	try {
		const token = req.cookies.token;
		const userId = await verifyToken(token);
		const { videoId } = req.method === 'POST' ? req.body : req.query;
		const findVideoById = await findVideoIdByUser(token, userId, videoId);
		const isStatsExist = findVideoById?.length > 0;
		if (!token) {
			res.status(403).send('Forbidden');
		}

		if (req.method === 'GET') {
			if (isStatsExist) {
				res.status(200).send({ msg: 'Get request to stats', findVideoById });
			} else res.status(404).send({ msg: 'Video not found' });
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
		res.status(500).send({ msg: 'Something went wrong with stats fetching!', err });
	}
}
