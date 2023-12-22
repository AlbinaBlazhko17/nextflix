import { magic } from '@/lib/magic-client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Loading } from '@/components';

import '@/styles/globals.scss';

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// (async () => {
		// 	const isLoggedIn = await magic.user.isLoggedIn();
		// 	if (isLoggedIn) {
		// 		router.replace('/');
		// 	} else {
		// 		router.replace('/login');
		// 	}
		// })();
	}, []);

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
