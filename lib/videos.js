const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://youtube.googleapis.com/youtube/v3';
const URL_FOR_POPULAR =
	'/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US';
const URL_FOR_SEARCH = '/search?part=snippet&maxResults=25&q=';

export const getVideos = async (searchQuery) => {
	try {
		const url = searchQuery === 'popular' ? URL_FOR_POPULAR : `${URL_FOR_SEARCH}${searchQuery}`;
		const response = await fetch(`${BASE_URL}${url}&key=${YOUTUBE_API_KEY}`);

		const videoData = await response.json();
		if ('error' in videoData) {
			console.error('Something went wrong with video fetching!', videoData.error);
			return [];
		}
		return videoData.items.map((item) => ({
			title: item?.snippet.title,
			imgUrl: item?.snippet.thumbnails.high.url,
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
