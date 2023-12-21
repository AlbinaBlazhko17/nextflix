import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import ExpandMoreIcon from '@/public/static/expand_more.svg';
import Image from 'next/image';
import { motion } from 'framer-motion';

import styles from './NavBar.module.scss';

function NavBar({ username }) {
	const [showDropdown, setShowDropdown] = useState(false);
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

	return (
		<div className={styles.navbar}>
			<div className={styles.navbar__wrapper}>
				<div className={styles.navbar__logo}>
					<a
						href="/"
						className={styles.navbar__logoLink}
					>
						Nextflix
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
								<Link href="/login">
									<a className={styles.navbar__sign}>Sign out</a>
								</Link>
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
