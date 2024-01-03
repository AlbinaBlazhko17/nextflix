import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { magic } from '@/lib/magic-client';
import Image from 'next/image';
import { Loading } from '@/components';

import styles from '../styles/Login.module.scss';

function Login() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [loadingRedirect, setLoadingRedirect] = useState(false);

	useEffect(() => {
		const handleStart = () => {
			setLoadingRedirect(true);
		};

		const handleComplete = () => {
			setLoadingRedirect(false);
		};

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleComplete);
		};
	}, [router]);

	function handleGoToHome() {
		magic.user.isLoggedIn().then((isLoggedIn) => {
			if (!isLoggedIn) {
				localStorage.setItem(email, email);
				router.push('/login');
			} else {
				router.push('/');
			}
		});
	}

	async function handleLogin(e) {
		e.preventDefault();
		if (email !== '') {
			try {
				setLoading(true);
				const didToken = await magic.auth.loginWithMagicLink({ email });
				if (didToken) {
					const response = await fetch('/api/login', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + didToken,
						},
					});

					const loggedInResponse = await response.json();
					if (loggedInResponse.done) {
						setLoading(false);
						router.push('/');
					} else {
						setError('Something went wrong');
						setLoading(false);
					}
				}
			} catch (error) {
				setError(error.message.slice(0, 30));
				setLoading(false);
			}
		} else {
			setError('Please enter a valid email address');
			router.push('/login');
		}
	}

	function handleOnChangeEmail(e) {
		if (e.target.value !== '') {
			setError(null);
			setEmail(e.target.value);
		} else {
			setError('Please enter a valid email address');
			setEmail('');
		}
	}
	return (
		<div className={styles.login}>
			<Head>
				<title>Nextflix | Login</title>
			</Head>
			<header className={styles.login__wrapper}>
				<div className={styles.login__logo}>
					<a
						onClick={handleGoToHome}
						className={styles.login__logoLink}
					>
						<Image
							src="/static/logo.svg"
							width={250}
							height={100}
							alt="logo"
						/>
					</a>
				</div>
			</header>
			<main className={styles.login__main}>
				{!loadingRedirect ? (
					<form className={styles.login__form}>
						<h1 className={styles.login__title}>Sign In</h1>
						<input
							name="email"
							type="email"
							placeholder="Email address"
							className={styles.login__input}
							onChange={handleOnChangeEmail}
							value={email}
							autoComplete="on"
						/>
						<p className={styles.login__error}>{error}</p>
						<button
							onClick={handleLogin}
							className={styles.login__btn}
						>
							{loading ? 'Loading...' : 'Sign In'}
						</button>
					</form>
				) : (
					<div className={styles.login__loading}>
						<Loading />
					</div>
				)}
			</main>
		</div>
	);
}

export default Login;
