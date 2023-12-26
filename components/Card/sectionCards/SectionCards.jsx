import { Card } from '@/components';
import Link from 'next/link';

import styles from './SectionCards.module.scss';

function SectionCards({ title, videos = [], size = 'medium' }) {
	return (
		<section className={styles.section}>
			<h2 className={styles.section__title}>{title}</h2>
			<div className={styles.section__cards}>
				{videos.map((video, index) => (
					<Link
						key={video.id}
						href={`/video/${video.id}`}
					>
						<a>
							<Card
								imgUrl={video.imgUrl}
								size={size}
								id={index}
							/>
						</a>
					</Link>
				))}
			</div>
		</section>
	);
}

export default SectionCards;
