import { Card } from '@/components';

import styles from './SectionCards.module.scss';

function SectionCards({ title, videos = [], size = 'medium' }) {
	return (
		<section className={styles.section}>
			<h2 className={styles.section__title}>{title}</h2>
			<div className={styles.section__cards}>
				{videos.map((video, index) => (
					<Card
						key={video.id}
						imgUrl={video.imgUrl}
						size={size}
						id={index}
					/>
				))}
			</div>
		</section>
	);
}

export default SectionCards;
