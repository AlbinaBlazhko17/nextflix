// import PlayIcon from '@public/static/play_arrow.svg';
import Image from 'next/image';

import styles from './Banner.module.scss';

function Banner({ title, subtitle }) {
	function handleOnPlay() {
		console.log('Handle on play');
	}
	return (
		<div className={styles.banner}>
			<div className={styles.banner__leftWrapper}>
				<div className={styles.banner__left}>
					<div className={styles.banner__nseries}>
						<p>N</p>
						<p>S E R I E S</p>
					</div>
					<h3 className={styles.banner__title}>{title}</h3>
					<h4 className={styles.banner__subtitle}>{subtitle}</h4>
					<div className={styles.banner__play}>
						<button onClick={handleOnPlay} className={styles.banner__playButton}>
							<Image src="/static/play_arrow.svg" alt="Play button" width={32} height={32} />
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
