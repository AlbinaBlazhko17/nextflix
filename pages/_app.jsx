import '@/styles/globals.scss';
import { Roboto_Slab } from 'next/font/google';

const roboto = Roboto_Slab({ weight: ['400', '600', '700'], subsets: ['latin'] });

function MyApp({ Component, pageProps }) {
	return (
		<div className={roboto.className}>
			<Component {...pageProps} />
		</div>
	);
}

export default MyApp;
