import { Loading } from '@/components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import '@/styles/globals.scss';

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const handleStart = () => {
			setIsLoading(true);
		};

		const handleComplete = () => {
			setIsLoading(false);
		};

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleComplete);
		};
	}, [router]);

	return isLoading ? <Loading /> : <Component {...pageProps} />;
}

export default MyApp;
