import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@/public/static/expand_more.svg';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { magic } from '@/lib/magic-client';
import cn from 'classnames';

import styles from './NavBar.module.scss';

function NavBar() {
	const [showDropdown, setShowDropdown] = useState(false);
	const [username, setUsername] = useState('');
	const [DIDToken, setDIDToken] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const router = useRouter();

	function handleOnClickHome(e) {
		e.preventDefault();
		router.push('/');
		setIsOpen(false);
	}

	function handleOnClickMyList(e) {
		e.preventDefault();
		router.push('/browse/my-list');
		setIsOpen(false);
	}

	function handleToogleDropdown(e) {
		e.preventDefault();
		setShowDropdown(!showDropdown);
	}

	async function handleSignOut(e) {
		e.preventDefault();
		setIsOpen(false);
		try {
			const response = await fetch('/api/logout', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${DIDToken}`,
					'Content-Type': 'application/json',
				},
			});

			await response.json();
		} catch (error) {
			console.error('Error logging out', error);
			router.replace('/login');
		}
	}

	function toggleMenu() {
		setIsOpen((prevState) => !prevState);
	}

	useEffect(() => {
		try {
			(async () => {
				const data = await magic.user.getInfo();
				const DidToken = await magic.user.getIdToken();
				if (data.email) {
					setUsername(data.email);
					setDIDToken(DidToken);
				}
			})();
		} catch (error) {
			router.push('/login');
			console.error(error);
		}
	}, []);

	return (
		<div className={styles.navbar}>
			<div className={styles.navbar__wrapper}>
				<div className={styles.navbar__logo}>
					<a
						href="/"
						className={styles.navbar__logoLink}
					>
						<Image
							src="/static/logo.svg"
							width={250}
							height={100}
							alt="logo"
						/>
					</a>
				</div>
				<div
					className={cn(styles.navbar__hamburger, {
						[styles['navbar__hamburger_active']]: isOpen,
					})}
					onClick={toggleMenu}
				>
					<div className={styles['navbar__hamburger-item']}></div>
					<div className={styles['navbar__hamburger-item']}></div>
					<div className={styles['navbar__hamburger-item']}></div>
				</div>
				<div
					className={cn(styles.navbar__menu, {
						[styles['navbar__menu_active']]: isOpen,
					})}
				>
					<ul className={styles.navbar__list}>
						<li
							className={styles['navbar__list-item']}
							onClick={handleOnClickHome}
						>
							Home
						</li>
						<li
							className={styles['navbar__list-item']}
							onClick={handleOnClickMyList}
						>
							My List
						</li>
					</ul>
					<nav className={styles.navbar__nav}>
						<div>
							<button
								className={styles.navbar__userBtn}
								onClick={handleToogleDropdown}
							>
								<p className={styles.navbar__username}>{username}</p>
								<div className={styles.navbar__expand}>
									<Image
										src={ExpandMoreIcon.src}
										width={20}
										height={20}
										alt="expand more"
									/>
								</div>
							</button>
							{showDropdown && (
								<motion.div
									initial={{ marginTop: '-1%', opacity: 0 }}
									animate={{ marginTop: '0.5rem', opacity: 1 }}
									exit={{ marginTop: '-1%', opacity: 0 }}
									transition={{ duration: 0.2 }}
									className={styles.navbar__dropdown}
								>
									<a
										className={styles.navbar__sign}
										onClick={handleSignOut}
									>
										Sign out
									</a>
									<div className={styles.navbar__line}></div>
								</motion.div>
							)}
						</div>
					</nav>
					<button className={styles.navbar__btn}>Sign out</button>
				</div>
			</div>
		</div>
	);
}

export default NavBar;
