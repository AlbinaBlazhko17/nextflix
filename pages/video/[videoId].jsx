import { Dislike, Like, NavBar } from '@/components';
import { getVideoDetails, getVideosId } from '@/lib/videos';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';

import styles from '@/styles/Video.module.scss';

Modal.setAppElement('#__next');

export async function getStaticProps(context) {
	const videoId = context.params.videoId;
	const videoData = await getVideoDetails(videoId);
	if (videoData.length === 0) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			video: videoData[0],
		},
		revalidate: 10,
	};
}

export async function getStaticPaths() {
	const videoIds = await getVideosId();
	const paths = videoIds.map((videoId) => ({
		params: { videoId },
	}));

	return { paths, fallback: 'blocking' };
}

function Video({ video }) {
	const router = useRouter();
	const { videoId } = router.query;
	const [toggleLike, setToggleLike] = useState(false);
	const [toggleDislike, setToggleDislike] = useState(false);

	useEffect(() => {
		(async () => {
			const response = await fetch(`/api/stats?videoId=${videoId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const resData = await response.json();
			if (resData?.findVideoById) {
				const favoritedRating = Boolean(resData.findVideoById[0].favorited);
				setToggleLike(favoritedRating);
				setToggleDislike(!favoritedRating);
			}
		})();
	}, [videoId]);

	async function runRatingService(favorited) {
		const response = await fetch('/api/stats', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				videoId,
				favorited,
				watched: true,
			}),
		});
		return response;
	}

	async function handleToggleLike() {
		setToggleDislike(false);
		setToggleLike((prevState) => !prevState);
		const response = await runRatingService(1);

		await response.json();
	}

	async function handleToggleDislike() {
		setToggleLike(false);
		setToggleDislike((prevState) => !prevState);
		const response = await runRatingService(0);

		await response.json();
	}

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
					<div className={styles.modal__buttons}>
						<button
							className={styles['modal__buttons-item']}
							onClick={handleToggleLike}
						>
							<Like selected={toggleLike} />
						</button>
						<button
							className={styles['modal__buttons-item']}
							onClick={handleToggleDislike}
						>
							<Dislike selected={toggleDislike} />
						</button>
					</div>
				</div>
				{video && (
					<div className={styles.modal__body}>
						<div className={styles.modal__body__wrapper}>
							<h2 className={styles.modal__date}>
								{video.date ? video.date.slice(0, 10) : ''}
							</h2>
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
								<p className={styles.modal__subtext}>
									{video.viewCount ? video.viewCount.viewCount : 0}
								</p>
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}

export default Video;
