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
