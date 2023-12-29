import { Banner, NavBar } from '@/components';
import SectionCards from '@/components/Card/sectionCards/SectionCards';
import { getVideos, getWatchItAgainVideos } from '@/lib/videos';
import { redirectUser } from '@/utils/redirectUser';
import Head from 'next/head';

import styles from '../styles/Home.module.scss';

export async function getServerSideProps(context) {
	const token = context.req ? context.req.cookies.token : null;
	const userId = await redirectUser(token);

	if (!userId) {
		return {
			props: {},
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}
	const disneyVideos = await getVideos('disney trailer');
	const productivityVideos = await getVideos('productivity');
	const travelVideos = await getVideos('travel');
	const popularVideos = await getVideos('popular');
	const watchItAgain = await getWatchItAgainVideos(token, userId);

	return {
		props: {
			disneyVideos,
			productivityVideos,
			travelVideos,
			popularVideos,
			watchItAgain,
		},
	};
}

export default function Home({
	disneyVideos,
	productivityVideos,
	travelVideos,
	popularVideos,
	watchItAgain,
}) {
	return (
		<div className={styles.container}>
			<Head>
				<title>Nextflix</title>
				<meta
					name="description"
					content="Generated by create next app"
				/>
				<link
					rel="icon"
					href="/favicon.ico"
				/>
			</Head>

			<NavBar />
			<Banner
				title="Title"
				subtitle="Subtitle"
				videoId="b9EkMc79ZSU"
			/>
			<SectionCards
				videos={disneyVideos}
				title="Disney"
				size="large"
			/>
			<SectionCards
				videos={watchItAgain}
				title="Watch it again"
				size="small"
			/>
			<SectionCards
				videos={travelVideos}
				title="Travel"
				size="small"
			/>

			<SectionCards
				videos={productivityVideos}
				title="Productivity"
				size="medium"
			/>

			<SectionCards
				videos={popularVideos}
				title="Popular"
				size="small"
			/>
		</div>
	);
}
