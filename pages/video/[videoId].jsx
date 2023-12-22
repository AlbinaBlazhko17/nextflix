import { useRouter } from 'next/router';

import styles from '@/styles/Video.module.scss';

function Video() {
	const router = useRouter();
	const { videoId } = router.query;

	return <div>Video page</div>;
}

export default Video;
