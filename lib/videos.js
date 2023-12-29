import { getWatchedVideos, getFavoritedVideos } from './db/hasura';
import videoDataFromJson from '@/data/videos.json';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://youtube.googleapis.com/youtube/v3';
const URL_FOR_POPULAR =
	'/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US';
const URL_FOR_SEARCH = '/search?part=snippet&maxResults=25&q=';

export const getVideos = async (searchQuery) => {
	try {
		const isDev = process.env.NODE_ENV;
		let videoData = [];
		if (isDev === 'development') {
			videoData = videoDataFromJson;
		} else {
			const url =
				searchQuery === 'popular' ? URL_FOR_POPULAR : `${URL_FOR_SEARCH}${searchQuery}`;
			const response = await fetch(`${BASE_URL}${url}&key=${YOUTUBE_API_KEY}`);

			videoData = await response.json();
			if ('error' in videoData) {
				console.error('Something went wrong with video fetching!', videoData.error);
				return [];
			}
		}
		return videoData.items.map((item) => ({
			title: item?.snippet.title,
			imgUrl: `https://i.ytimg.com/vi/${item.id.videoId || item.id}/maxresdefault.jpg`,
			id: item?.id.videoId || item.id,
		}));
	} catch (error) {
		console.error('Something went wrong with video fetching!', error);
		return [];
	}
};

export const getVideoDetails = async (videoId) => {
	try {
		const response = await fetch(
			`${BASE_URL}/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${YOUTUBE_API_KEY}`,
		);
		const videoData = await response.json();
		if ('error' in videoData) {
			console.error('Something went wrong with video details fetching!', videoData.error);
			return {};
		}
		return videoData?.items.map((item) => {
			const snippet = item.snippet;
			const id = item.id?.videoId || item.id;

			return {
				title: snippet?.title,
				id,
				imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
				description: snippet.description,
				date: snippet.publishedAt,
				cast: snippet.channelTitle,
				viewCount: item.statistics ? item.statistics : { viewCount: 0 },
			};
		});
	} catch (error) {
		console.error('Something went wrong with video details fetching!', error);
		return {};
	}
};

export const getVideoStats = async (videoId) => {
	try {
		const data = await fetch(`http://localhost:3000/api/stats?videoId=${videoId}`, {
			method: 'GET',
		});
		const stats = await data.json();
		return stats;
	} catch (err) {
		console.error('Something went wrong with video stats fetching!', err);
		return {};
	}
};

export const getWatchItAgainVideos = async (token, userId) => {
	const videos = await getWatchedVideos(token, userId);
	return videos.map((video) => ({
		id: video.videoId,
		imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
	}));
};

export const getMyListVideos = async (token, userId) => {
	const videos = await getFavoritedVideos(token, userId);
	return videos.map((video) => ({
		id: video.videoId,
		imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
	}));
};
