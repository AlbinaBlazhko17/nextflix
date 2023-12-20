import '../styles/globals.css';
import { Roboto } from 'next/font/google';

const roboto = Roboto({ weight: ['400'], subsets: ['latin'] });

function MyApp({ Component, pageProps }) {
	return (
		<div className={roboto.className}>
			<Component {...pageProps} />
		</div>
	);
}

export default MyApp;
