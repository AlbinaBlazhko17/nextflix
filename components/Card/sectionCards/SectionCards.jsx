import { Card } from '@/components';
import Link from 'next/link';
import cn from 'classnames';

import styles from './SectionCards.module.scss';

function SectionCards({ title, videos = [], size = 'medium', shouldWrap = false }) {
	return (
		<section className={styles.section}>
			<h2 className={styles.section__title}>{title}</h2>
			<div
				className={cn(styles.section__cards, {
					[styles['section__cards-nowrap']]: shouldWrap,
				})}
			>
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
