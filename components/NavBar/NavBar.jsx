import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@/public/static/expand_more.svg';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { magic } from '@/lib/magic-client';

import styles from './NavBar.module.scss';

function NavBar() {
	const [showDropdown, setShowDropdown] = useState(false);
	const [username, setUsername] = useState(localStorage.getItem('email') || '');
	const router = useRouter();

	function handleOnClickHome(e) {
		e.preventDefault();
		router.push('/');
	}

	function handleOnClickMyList(e) {
		e.preventDefault();
		router.push('/my-list');
	}

	function handleToogleDropdown(e) {
		e.preventDefault();
		setShowDropdown(!showDropdown);
	}

	function handleSignOut(e) {
		e.preventDefault();
		localStorage.removeItem('email');
		magic.user.logout().then(() => {
			router.push('/login');
		});
	}

	useEffect(() => {
		try {
			(async () => {
				const data = await magic.user.getMetadata();
				if (data.email) {
					setUsername(data.email);
				}
			})();
		} catch (error) {
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
			</div>
		</div>
	);
}

export default NavBar;
