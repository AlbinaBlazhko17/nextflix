import Image from 'next/image';

import styles from './Loading.module.scss';

function Loading() {
	return (
		<div className={styles.loading}>
			<Image
				src="/static/loading.svg"
				width={100}
				height={100}
				alt="loading"
			/>
		</div>
	);
}

export default Loading;
