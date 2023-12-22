import NIcon from '@/public/static/Netflix_icon.png';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from './Banner.module.scss';

function Banner({ title, subtitle, videoId }) {
	const router = useRouter();

	function handleOnPlay() {
		router.push(`/video/${videoId}`);
	}

	return (
		<div className={styles.banner}>
			<div className={styles.banner__leftWrapper}>
				<div className={styles.banner__left}>
					<div className={styles.banner__nseries}>
						<div className={styles.banner__n}>
							<Image
								src={NIcon}
								alt="N"
								layout="fill"
								objectFit="contain"
							/>
						</div>
						<p>S E R I E S</p>
					</div>
					<h3 className={styles.banner__title}>{title}</h3>
					<h4 className={styles.banner__subtitle}>{subtitle}</h4>
					<div className={styles.banner__play}>
						<button
							onClick={handleOnPlay}
							className={styles.banner__playButton}
						>
							<Image
								src="/static/play_arrow.svg"
								alt="Play button"
								width={32}
								height={32}
							/>
							<span className={styles.banner__playText}>Play</span>
						</button>
					</div>
				</div>
			</div>
			<div className={styles.banner__bg}></div>
		</div>
	);
}

export default Banner;
