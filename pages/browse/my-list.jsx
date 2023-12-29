import { NavBar, SectionCards } from 'components/index';
import Head from 'next/head';
import { getMyListVideos } from '@/lib/videos';
import { getUserIdAndToken } from '@/utils/getUserIdAndToken';

import styles from '@/styles/MyList.module.scss';

export async function getServerSideProps(context) {
	const { userId, token } = await getUserIdAndToken(context);
	const videos = await getMyListVideos(token, userId);
	return {
		props: {
			videos,
		},
	};
}

function MyList({ videos }) {
	return (
		<div>
			<Head>
				<title>My list</title>
			</Head>
			<main className={styles['my-list']}>
				<NavBar />
				<div className={styles['my-list__wrapper']}>
					<SectionCards
						title="My list"
						videos={videos}
						size="small"
						shouldWrap
					/>
				</div>
			</main>
		</div>
	);
}

export default MyList;
