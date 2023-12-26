import styles from '@/styles/Video.module.scss';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { getVideoDetails } from '@/lib/videos';
import { NavBar } from '@/components';

Modal.setAppElement('#__next');

export async function getStaticProps(context) {
	const videoId = context.params.videoId;
	const videoData = await getVideoDetails(videoId);

	return {
		props: {
			video: videoData[0],
		},
		revalidate: 10,
	};
}

export async function getStaticPaths() {
	const listOfVideos = ['ifgsdju4313', 'R1ZXOOLMJ8s', 'EY6BLb6-0dU'];

	const paths = listOfVideos.map((videoId) => ({
		params: { videoId },
	}));

	return { paths, fallback: 'blocking' };
}

function Video({ video }) {
	const router = useRouter();
	const { videoId } = router.query;

	return (
		<div className={styles.modal}>
			<NavBar />
			<Modal
				isOpen={true}
				contentLabel={`Video: ${videoId}`}
				onRequestClose={() => router.back()}
				className={styles.modal__content}
				overlayClassName={styles.modal__overlay}
			>
				<div className={styles.modal__video}>
					<iframe
						className={styles.modal__video__iframe}
						id="player"
						type="text/html"
						width="100%"
						height="450px"
						src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com&controls=0&rel=1`}
						frameBorder="0"
					></iframe>
				</div>
				<div className={styles.modal__body}>
					<div className={styles.modal__body__wrapper}>
						<h2 className={styles.modal__date}>{video.date.slice(0, 10)}</h2>
						<h1 className={styles.modal__title}>{video.title}</h1>
						<p className={styles.modal__description}>{video.description}</p>
					</div>
					<div>
						<div className={styles.modal__sidebar}>
							<h3 className={styles.modal__subtitle}>Cast: </h3>
							<p className={styles.modal__subtext}>{video.cast}</p>
						</div>
						<div className={styles.modal__sidebar}>
							<h3 className={styles.modal__subtitle}>View count: </h3>
							<p className={styles.modal__subtext}>{video.viewCount.viewCount}</p>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default Video;
